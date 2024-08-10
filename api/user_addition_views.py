
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from .user_addition_models import UserNote
from .user_addition_serializers import UserNoteValidator, UserNoteSerializer, UserExamplesSenseSerializer, UserWordSerializer, KoreanWordForEditingSerializer
from .dictionary_models import HanjaCharacter, KoreanWord, Sense
from .dictionary_serializers import HanjaCharacterSerializer, KoreanWordSerializer, SenseSerializer, KoreanSerializerForHanja, WordOriginSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from django.db import transaction
from rest_framework.parsers import MultiPartParser, FormParser
import os
import math

import json

from .util import reorder_queryset_with_seed, get_nouns_verbs

class RedirectingPagination(PageNumberPagination):
  page_size = 10

  def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.redirect_url = None

  def paginate_queryset(self, queryset, request, view=None):
    try:
      return super().paginate_queryset(queryset, request)
    except Exception as e:
      requested_page = int(request.query_params.get(self.page_query_param, 1))
      max_page = math.ceil(queryset.count() / self.page_size)

      if requested_page > max_page:
        new_url = request.build_absolute_uri()
        new_url = new_url.replace(f'page={requested_page}', f'page={max_page}')
      
        self.redirect_url = new_url
        return []
      else:
        raise

class KoreanWordForEditingView(generics.RetrieveAPIView):
  """API view to get data for editing a word from its pk."""
  permission_classes = (IsAuthenticated, )
  serializer_class = KoreanWordForEditingSerializer

  def get_queryset(self):
    queryset = KoreanWord.objects.all()
    return queryset

class CreateNoteView(APIView):
  """API view to create a new note."""
  permission_classes = (IsAuthenticated,)
  parser_classes = (MultiPartParser, FormParser,)

  def post(self, request):
    data = request.data
    data['creator'] = request.user.pk
    serializer = UserNoteValidator(data=data, context={'request': request})
    if serializer.is_valid():
      note = serializer.save()
      note_data = UserNoteSerializer(note).data
      note_data['id'] = note.pk
      return Response(note_data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteNoteView(APIView):
    """API view to delete a note and its image if it has one."""
    permission_classes = (IsAuthenticated,)

    def delete(self, request, pk):
      note = get_object_or_404(UserNote, pk=pk)

      if note.creator != request.user:
        return Response({"detail": "You don't have permission to delete this note."},
                        status=status.HTTP_403_FORBIDDEN)

      serialized_data = UserNoteSerializer(note).data

      if note.note_image:
        if os.path.isfile(note.note_image.path):
          os.remove(note.note_image.path)

      note.delete()

      return Response(serialized_data, status=status.HTTP_200_OK)

class UpdateNoteView(UpdateAPIView):
  """API view to update a note from its pk."""
  permission_classes = (IsAuthenticated,)
  queryset = UserNote.objects.all()
  serializer_class = UserNoteValidator
  parser_classes = (MultiPartParser, FormParser)

  def get_object(self):
    obj = super().get_object()
    if obj.creator != self.request.user:
        self.permission_denied(self.request)
    return obj

  def update(self, request, *args, **kwargs):
    partial = kwargs.pop('partial', False)
    instance = self.get_object()
    old_image = instance.note_image

    serializer = self.get_serializer(instance, data=request.data, partial=partial)
    serializer.is_valid(raise_exception=True)
    self.perform_update(serializer)

    if old_image and old_image != instance.note_image:
        if os.path.isfile(old_image.path):
            os.remove(old_image.path)

    return Response(serializer.data)

class CreateWordView(APIView):

  permission_classes = (IsAuthenticated, )

  def post(self, request):
    data = request.data
    data['creator'] = request.user.pk
    serializer = UserWordSerializer(data = data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CreateExamplesSenseView(APIView):
  permission_classes = (IsAuthenticated,)

  def post(self, request):
    data = request.data
    data['creator'] = request.user.pk
    serializer = UserExamplesSenseSerializer(data = data, context={'request': request})
    if serializer.is_valid():
        # delete the previous if it exists; this method is essentially PUT
        # need to ensure atomicity so that a sense cannot be deleted without its
        # replacement being added

        new_data = serializer.validated_data

        with transaction.atomic():
          prev_sense = Sense.objects.all().filter(
              order = 0).filter( 
              referent = serializer.validated_data['referent']).filter(
              creator = serializer.validated_data['creator'])
          
          prev_sense_data = None
          if prev_sense.exists():
            prev_sense_data = prev_sense.first()

          if prev_sense_data and new_data['additional_info'] == prev_sense_data.additional_info:
            return Response({'errors': {'바꾸신 내용이 없습니다.'}}, status=status.HTTP_400_BAD_REQUEST)

          prev_sense.delete()

          serializer.save()
          return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
      all_errors = []
      for error_list in serializer.errors.values():
          all_errors.extend(error_list)
      return Response({'errors': all_errors}, status=status.HTTP_400_BAD_REQUEST)

class DeleteSenseView(APIView):
  """API view to delete a sense from its pk."""

  permission_classes = (IsAuthenticated,)

  def delete(self, request, pk):
    
    senses = Sense.objects.all().filter(pk = pk)
    if not senses.exists():
      return Response({"errors": ["삭제할 수 없습니다."]}, status=status.HTTP_404_NOT_FOUND)
    
    sense = senses.first()

    if sense.creator is None or sense.creator != request.user:
      return Response({"errors": ["삭제할 수 없습니다."]}, status=status.HTTP_403_FORBIDDEN)
    
    with transaction.atomic():
      serialized_data = SenseSerializer(sense).data
      sense.delete()
      return Response(serialized_data, status=status.HTTP_200_OK)

class UpdateWordView(UpdateAPIView):
  """API view to update a word from its pk."""
  permission_classes = (IsAuthenticated,)

  queryset = KoreanWord.objects.all()
  serializer_class = KoreanWordSerializer

class ToggleWordKnownView(APIView):
  """
    API view to set a word to known or not known by the authenticated user.
    The pk of the word should be passed in via the url. POST requests set the word to
    known, while DELETE requests set the word to unknown.
  """
  permission_classes = (IsAuthenticated,)

  def put(self, request, pk, format=None):
    try:
      korean_word = KoreanWord.objects.get(pk=pk)
      user = request.user

      if korean_word not in user.known_words.all():
        user.known_words.add(korean_word)
        user.save()

        serializer = KoreanWordSerializer(korean_word, context={'request': request})
        return Response(serializer.data)
      
      return Response(status= status.HTTP_200_OK, data={"detail": "Word is already known."})
    except KoreanWord.DoesNotExist:
      return Response(status=status.HTTP_404_NOT_FOUND)

  def delete(self, request, pk, format=None):
    try:
      korean_word = KoreanWord.objects.get(pk=pk)
      user = request.user

      if korean_word in user.known_words.all():
        user.known_words.remove(korean_word)
        user.save()

        serializer = KoreanWordSerializer(korean_word, context={'request': request})
        return Response(serializer.data)
      
      return Response(status= status.HTTP_200_OK, data={"detail": "Word is already unknown."})
  
    except KoreanWord.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
class ToggleWordStudiedView(APIView):
  """
    API view to set a word to studied or not studied by the authenticated user.
    The pk of the word should be passed in via the url. POST requests set the word to
    studied, while DELETE requests set the word to not studied.
  """
  permission_classes = (IsAuthenticated,)

  def put(self, request, pk, format=None):
    try:
      korean_word = KoreanWord.objects.get(pk=pk)
      user = request.user

      if korean_word not in user.study_words.all():
          user.study_words.add(korean_word)
          user.save()
          serializer = KoreanWordSerializer(korean_word, context={'request': request})
          return Response(serializer.data)
      else:
        return Response(status= status.HTTP_200_OK, data={"detail": "Word is already studied."})
    
    except KoreanWord.DoesNotExist:
      return Response(status=status.HTTP_404_NOT_FOUND)

  def delete(self, request, pk, format=None):
    try:
      korean_word = KoreanWord.objects.get(pk=pk)
      user = request.user

      if korean_word in user.study_words.all():
        user.study_words.remove(korean_word)
        user.save()
        serializer = KoreanWordSerializer(korean_word, context={'request': request})
        return Response(serializer.data)
      else:
        return Response(status= status.HTTP_200_OK, data={"detail": "Word is already not studied."})
    except KoreanWord.DoesNotExist:
      return Response(status=status.HTTP_404_NOT_FOUND)

class UpdateSenseView(UpdateAPIView):
  """API view to update a sense from its pk."""
  permission_classes = (IsAuthenticated,)

  queryset = Sense.objects.all()
  serializer_class = SenseSerializer

class UserKnownWords(generics.ListAPIView):
  """API view to retrieve the list of all known words for the authenticated user."""
  permission_classes = (IsAuthenticated, )
  serializer_class = KoreanWordSerializer
  pagination_class = RedirectingPagination

  def get_queryset(self):
    known_words = self.request.user.known_words.all()
    return known_words.order_by('target_code')
  
  def list(self, request, *args, **kwargs):
    queryset = self.filter_queryset(self.get_queryset())
    page = self.paginate_queryset(queryset)
    if page is not None:
        if self.paginator.redirect_url:
            return HttpResponseRedirect(self.paginator.redirect_url)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data)
  
class UserStudyWords(generics.ListAPIView):
  """API view to retrieve the list of all study words for the authenticated user."""
  permission_classes = (IsAuthenticated, )
  serializer_class = KoreanWordSerializer
  pagination_class = RedirectingPagination

  def get_queryset(self):
    study_words = self.request.user.study_words.all()
    return study_words.order_by('target_code')

  def list(self, request, *args, **kwargs):
    queryset = self.filter_queryset(self.get_queryset())
    page = self.paginate_queryset(queryset)
    if page is not None:
        if self.paginator.redirect_url:
            return HttpResponseRedirect(self.paginator.redirect_url)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data)

class UserStudyWordTargetCodes(APIView):

  permission_classes = (IsAuthenticated, )

  def get(self, request):

    seed = int(self.request.query_params.get('seed', 1000))
    max_returned = 1000
    words = (
      reorder_queryset_with_seed(self.request.user.study_words, seed)
      .values_list('target_code', flat=True)[:max_returned]
    )

    if not words:
      return Response({'errors': ['공부하는 단어가 없습니다.']}, status=status.HTTP_404_NOT_FOUND)

    return Response({'target_codes': list(words)}, status=status.HTTP_200_OK)
  
class HomepageInfoView(APIView):
  """
    API view to retrieve information for the application's homepage if the user is authenticated.

    Returns an object containing a pair of words that contain at least one of the same
    hanja character and a word in the user's study words list.

    Query Parameters:
      seed (int, optional): A seed value for randomization. Defaults to 1000.

    Returns:
      Response: A dictionary containing:
        - `same_hanja`: The dictionary of hanja characters and corresponding words sharing that character.
        - `random_study_words`: The list of words from the user's study words.
  """
  permission_classes = (IsAuthenticated, )

  def get(self, request):

    seed = int(self.request.query_params.get('seed', 1000))

    known_words = reorder_queryset_with_seed(self.request.user.known_words.all(), seed)
    
    # can make variable number but having too many is information overload
    # TODO fix: currently increasing this number gives a second pairing that also includes the first
    # word from the first pair
    num_same_hanja_examples = 1
    retrieved = 0
    same_hanja_examples = {}
    selected_hanja_chars = []

    for word in known_words:
      if retrieved >= num_same_hanja_examples:
        break

      for character in word.origin:
        if ord(character) >= 0x4e00 and ord(character) <= 0x9fff and character not in selected_hanja_chars:
          first_two = known_words.filter(origin__contains = character)[:2]
          if len(first_two) < 2:
            continue
          retrieved = retrieved + 1
          selected_hanja_chars.append(character)
          same_hanja_examples[character] = KoreanSerializerForHanja(first_two, many = True, context = {'request': request}).data

          if retrieved >= num_same_hanja_examples:
            break

    num_random_study_words = 1

    random_study_words = KoreanWordSerializer(
      reorder_queryset_with_seed(self.request.user.study_words.all(), seed=seed)[:num_random_study_words],
      many = True,
      context = {'request': request}) \
      .data

    return Response({
      'same_hanja': same_hanja_examples,
      'random_study_words': random_study_words,
    })

def get_path_of_length(queryset, length: int, request) -> list:
  """
    Finds a path that a user can take to solve the hanja connection game.

    Arguments:
      queryset (QuerySet, required): the queryset containing the words to be considered while creating the path.
      length (int, required): the target length of the path through the queryset.
      request (Request, required): the request context.

    Returns:
      A list of serialized Hanja characters representing the path if a path could be generated, or 
      None if a path could not be found.
  """
  # Finds a path that the user can take to solve the game.
  # Can consider that words in queryset are vertices and bidirectional edges connect any two nodes
  # that share at least one hanja character in their origin. Then this method must return any path
  # in the graph formed by queryset of the given length or None if one does not exist.

  hanja_path = []
  # Hanja path in the form of [[character, word to connect this], 
  # [next character, next word]] etc. So an example would be
  # [[力 힘 력, 전력], [電 번개 전, 축전지], [蓄 모을 축, 비축]] if the puzzle
  # was to get from 力 힘 력 to 備 갖출 비 and the number of steps was only 2

  step_characters = [""] * length
  tried_lists = [[] for _ in range (length)]
  step_word_origins = [""] * length

  step_counter = 0
  
  while True:
    
    required = step_characters[step_counter - 1]
    banned = "".join(char for char in tried_lists[step_counter])
    for word in step_word_origins[:step_counter]:
      for char in word:
        if char != required and char not in banned:
          banned = banned + char

    # Filter working set based on currently banned (already used in path's words or tried to no 
    # success) characters and the required character (the most recently added char to the actual 
    # path)
    regex = ""

    if banned != "":
      regex += f'^[^{banned}]*'
    if required != "":
      regex += f'[{required}]'
    if banned != "":
      regex += f'[^{banned}]*$'
    if regex == "":
      regex = '.*'

    working_set = queryset.filter(origin__iregex = regex)

    # Look for link
    found_link = False
    for valid_word in working_set:
      # Check this word for any valid link
      for character in valid_word.origin:
        if character not in tried_lists[step_counter] and \
                character not in step_characters and \
                HanjaCharacter.objects.filter(pk = character).exists():
          
          found_link = True

          hanja_path.append({
            'step_character': HanjaCharacterSerializer(
                        HanjaCharacter.objects.get(pk = character)).data,
            'example_word': WordOriginSerializer(
                        valid_word, context = {'request': request}).data,
            })
          
          step_characters[step_counter] = character
          step_word_origins[step_counter] = valid_word.origin

          break # out of for character in valid_word

      if found_link:
        break # out of for valid_word in working_set

    # step_counter and list of characters already updated; dont need to do again
    if found_link:
      step_counter += 1

      if step_counter >= length:
        return hanja_path

    else:

      # If even at step_counter 0 there is no character to match, then it has cycled
      # through every single word and needs to just return None. There is no path of
      # the required length.
      if step_counter == 0:
        return None

      tried_lists[step_counter - 1].append(step_characters[step_counter - 1])
      step_characters[step_counter] = ""
      step_word_origins[step_counter] = ""
      hanja_path.pop()

      step_counter -= 1

class HanjaGameView(APIView):
  """
    API view to retrieve information for the application's hanja game for the currently authenticated user.
    
    Query Parameters:
      length (int, optional): The target length of the hanja path. Defaults to 3.
      seed (int, optional): A seed value for randomization. Defaults to 1000.

    Returns:
      Response: A dictionary containing:
        
        On Success:
        - `start_from`: The serialized Hanja character from which the generated path starts.
        - `go_to`: The serialized Hanja character at which the generated path ends.
        - `num_requirements`: A list of serialized Hanja characters that must be used in the game.
        - `supplied_characters`: The list of Hanja characters usable in the generated game.
        - `hanja_path`: The path generated.
      
        On Failure:
        - `error`: The encountered error.
  """
  permission_classes = (IsAuthenticated, )

  def get(self, request):

    length = int(self.request.query_params.get('length', 3))
    seed = int(self.request.query_params.get('seed', 1000))

    hanja_path = []

    all_known_words = request.user.known_words.all()
    valid_regex = r'^[\u4e00-\u9fff]{2,}$'
    # invalid_regex excludes words with only the same character repeating
    invalid_regex = r'^(.)\1+$'
    valid_known_words = all_known_words \
                      .filter(origin__iregex = valid_regex) \
                      .exclude(origin__iregex = invalid_regex)

    valid_known_words = reorder_queryset_with_seed(valid_known_words, seed)
    hanja_path = get_path_of_length(queryset=valid_known_words, length=length, request=self.request)
    
    if not hanja_path:
      return Response({
        "errors": ["아는 단어가 부족하여 게임을 생성할 수 없었습니다."]
      }, status=status.HTTP_404_NOT_FOUND)

    path_length = len(hanja_path)

    first = hanja_path[0]["step_character"]["character"]
    # Due to the way that the algorithm works, there is no guarantee that the word
    # chosen as start_from (or that any char in the array) is in HanjaCharacter.objects; 
    # it will need to be conditionally serialized before being returned in response
    possible_start_from = [char for char in hanja_path[0]["example_word"]["origin"] 
                    if char != first and ord(char) >= 0x4e00 and ord(char) <= 0x9fff]
    start_from = possible_start_from[seed % len(possible_start_from)]
    
    start_from_to_return = None
    if HanjaCharacter.objects.filter(pk = start_from).exists():
      start_from_to_return = HanjaCharacterSerializer(HanjaCharacter.objects.get(pk = start_from)).data
    else:
      start_from_to_return = {
        'character': start_from
      }

    go_to = hanja_path[path_length - 1]["step_character"]["character"]

    supplied_characters = []
    for word_on_path in hanja_path:
      for character in word_on_path["example_word"]["origin"]:
        if character not in supplied_characters:
          supplied_characters.append(character)

    num_supplied_characters = len(supplied_characters)
    num_supplied_needed = 16
    
    if num_supplied_characters < num_supplied_needed:
      index = 0

      while num_supplied_characters < num_supplied_needed and index < len(all_known_words):
        for character in all_known_words[index].origin:
          if ord(character) > 0x4e00 and ord(character) < 0x9fff and \
            character not in supplied_characters and num_supplied_characters < num_supplied_needed:
              num_supplied_characters += 1
              supplied_characters.append(character)
        index += 1

    def reorder(list, seed):
      # this is only meant for lists of length not more than 16
      new_list = ['' for _ in range (0, len(list))]
      used = []
      
      a = (seed >> 10) & 31
      b = (seed >> 5) & 31
      c = (seed) & 31
      const = seed % 15
      
      def new_index(original_index):
        new = ((original_index - a) * (original_index - b) * (original_index - c) + const) % 15
        while new in used:
          new += 1
          if new > len(list) - 1:
            new = 0
        used.append(new)
        return new
    
      for i in range(0, len(list)):
        new_list[new_index(i)] = list[i]

      return new_list

    # done twice to promote more separation of the generated path's characters (?)
    #supplied_characters = reorder(reorder(supplied_characters, seed), seed * 2 + seed)
    supplied_characters = reorder(supplied_characters, seed)

    return Response({
      'start_from': start_from_to_return,
      'go_to': HanjaCharacterSerializer(HanjaCharacter.objects.get(pk = go_to)).data,
      'supplied_characters': supplied_characters,
      'hanja_path': hanja_path
    })

class HanjaGameSolutionVerifierView(APIView):
  permission_classes = (IsAuthenticated,)

  def post(self, request):

    words = request.data['words']

    if words is None:
      return Response({
        "errors": ["한자어들을 제공하지 않았습니다."]
      }, status=status.HTTP_400_BAD_REQUEST)
    try:
      words = json.loads(words)
    except json.decoder.JSONDecodeError:
      return Response({
        "errors": ["한자어 목록을 json으로 변환하다가 오류가 발생했습니다."]
      }, status=status.HTTP_400_BAD_REQUEST)
    if len(words) == 0:
      return Response({
        "errors": ["한자어들을 제공하지 않았습니다."]
      }, status=status.HTTP_400_BAD_REQUEST)

    allowed_characters = request.data['allowed_characters']
    if allowed_characters is None:
      return Response({
        "errors": ["게임용 한자들을 제공하지 않았습니다."]
      }, status=status.HTTP_400_BAD_REQUEST)
    try:
      allowed_characters = json.loads(allowed_characters)
    except json.decoder.JSONDecodeError:
      return Response({
        "errors": ["게임용 한자 목록을 json으로 변환하다가 오류가 발생했습니다."]
      }, status=status.HTTP_400_BAD_REQUEST)
    if len(allowed_characters) == 0:
      return Response({
        "errors": ["게임용 한자들을 제공하지 않았습니다."]
      }, status=status.HTTP_400_BAD_REQUEST)

    start_from = request.data['start_from']
    go_to = request.data['go_to']
    
    if start_from is None or len(start_from) == 0:
      return Response({
        "errors": ["출발 자를 제공하지 않았습니다."]
      }, status=status.HTTP_400_BAD_REQUEST)
    
    if go_to is None or len(go_to) == 0:
      return Response({
        "errors": ["도착 자를 제공하지 않았습니다."]
      }, status=status.HTTP_400_BAD_REQUEST)

    errors = []
    
    final_index = 3

    for i in range (len(words)):

      if words[i] == "":
        final_index = i - 1
        break

      errors_for_character = []

      if not KoreanWord.objects.filter(origin__exact = words[i]).exists():
        errors_for_character.append(f"{words[i]}는 단어가 아닌 것 같습니다.")

      for character in words[i]:
        if character not in allowed_characters:
          errors_for_character.append(f"{character}는 게임용 한자가 아닙니다.")
        if character == go_to:
          word_with_final_index = i

      if i > 0:
        found_link = False
        for char in words[i]:
          if char in words[i-1]:
            found_link = True
      
        if not found_link:
          errors_for_character.append("이전 줄 한자어와 공통 한자가 포함되지 않습니다.")

      errors.append(errors_for_character)

      # if true then it was just found
      if i == final_index:
        break
    
    if start_from not in words[0]:
      errors[0].append("첫 한자어는 출발 자가 포함되어야 합니다.")
    
    if go_to not in words[final_index]:
      errors[final_index].append("마지막 한자어는 도착 자가 포함되어야 합니다.")

    for error_list in errors:
      if len(error_list) > 0:
        return Response({
          "verifier_errors": errors,
        }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response("좋습니다", status=status.HTTP_200_OK)
    
class UnknownWordsView(APIView):
  """
    API view to retrieve all words in a given text that the authenticated user does not know any 
    definition of. Takes a POST request.

    POST body keys:
      - `text`: The text from which to extract unknown words.

    Returns:
      A dictionary containing:

      On Success:
        - `unknown`: A list of words (strings) that the user does not know from the supplied text. 

      On Failure:
        - `error`: The encountered error.
  """
  permission_classes = (IsAuthenticated, )

  def post(self, request):

    text = request.data['text']

    if text is None or text == '':
      return Response({'errors': ['분석할 입력어가 없습니다.']}, status=status.HTTP_400_BAD_REQUEST)

    user_known_words = request.user.known_words.all()

    try:
      analysis, _ = get_nouns_verbs(text)
    except Exception:
      return Response({'errors': [f'분석하면서 오류가 발생했습니다.']}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    all_analyzed = []

    for i in range(0, len(analysis)):
      all_analyzed.append(analysis[i][0] + "다" if analysis[i][1].startswith("V") else analysis[i][0])

    user_doesnt_know = [word for word in all_analyzed if 
                        not user_known_words.filter(word = word).exists()
                        and KoreanWord.objects.filter(word = word).exists()]

    # delete duplicates
    user_doesnt_know_unique = []
    for word in user_doesnt_know:
      if word not in user_doesnt_know_unique:
        user_doesnt_know_unique.append(word)
    
    return Response({'unknown': user_doesnt_know_unique}, status=status.HTTP_200_OK)