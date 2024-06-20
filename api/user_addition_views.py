
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from .user_addition_models import UserNote
from .user_addition_serializers import UserNoteValidator, UserSenseSerializer, UserWordSerializer, KoreanWordForEditingSerializer
from .dictionary_models import HanjaCharacter, KoreanWord, Sense
from .dictionary_serializers import HanjaCharacterSerializer, KoreanWordSerializer, SenseSerializer, KoreanSerializerForHanja, WordOriginSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
import random
from django.db import transaction
from rest_framework.parsers import MultiPartParser, FormParser

from .util import reorder_queryset_with_seed, get_nouns_verbs

# Page size = 10
class PaginationClass(PageNumberPagination):
  page_size = 10

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
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    
class CreateSenseView(APIView):
  permission_classes = (IsAuthenticated,)

  def post(self, request):
    data = request.data
    data['creator'] = request.user.pk
    serializer = UserSenseSerializer(data = data, context={'request': request})
    if serializer.is_valid():
        # delete the previous if it exists; this method is essentially PUT
        # need to ensure atomicity so that a sense cannot be deleted without its
        # replacement being added
        with transaction.atomic():
          prev_sense = Sense.objects.all().filter(
              order = 0).filter( 
              referent = serializer.validated_data['referent']).filter(
              creator = serializer.validated_data['creator'])
          
          if prev_sense.exists():
            prev_sense.delete()

          serializer.save()
          return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteSenseView(APIView):
  """API view to delete a sense from its pk."""

  permission_classes = (IsAuthenticated,)

  def delete(self, request, pk):
    
    senses = Sense.objects.all().filter(pk = pk)
    if not senses.exists():
      return Response({"error": "삭제할 수 없습니다."}, status=status.HTTP_404_NOT_FOUND)
    
    sense = senses.first()

    if sense.creator is None or sense.creator != request.user:
      return Response({"error": "삭제할 수 없습니다."}, status=status.HTTP_403_FORBIDDEN)
    
    with transaction.atomic():
      sense.delete()
      return Response({"message": "삭제가 성공했습니다."}, status=status.HTTP_200_OK)

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
      
      return Response(status= status.HTTP_400_BAD_REQUEST, data={"detail": "Word is already known."})
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
      
      return Response(status= status.HTTP_400_BAD_REQUEST, data={"detail": "Word is already unknown."})
  
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
    except KoreanWord.DoesNotExist:
      return Response(status=status.HTTP_404_NOT_FOUND)

class UpdateSenseView(UpdateAPIView):
  """API view to update a sense from its pk."""
  permission_classes = (IsAuthenticated,)

  queryset = Sense.objects.all()
  serializer_class = SenseSerializer

class UpdateNoteView(UpdateAPIView):
  """API view to update a note from its pk."""
  permission_classes = (IsAuthenticated,)

  queryset = UserNote.objects.all()
  serializer_class = UserNoteValidator

class UserKnownWords(generics.ListAPIView):
  """API view to retrieve the list of all known words for the authenticated user."""
  permission_classes = (IsAuthenticated, )
  serializer_class = KoreanWordSerializer
  pagination_class = PaginationClass

  def get_queryset(self):
    known_words = self.request.user.known_words.all()
    return known_words
  
class UserStudyWords(generics.ListAPIView):
  """API view to retrieve the list of all study words for the authenticated user."""
  permission_classes = (IsAuthenticated, )
  serializer_class = KoreanWordSerializer
  pagination_class = PaginationClass

  def get_queryset(self):
    study_words = self.request.user.study_words.all()
    return study_words
  
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
    valid_known_words = all_known_words.filter(origin__iregex = valid_regex)

    valid_known_words = reorder_queryset_with_seed(valid_known_words, seed)
    hanja_path = get_path_of_length(queryset=valid_known_words, length=length, request=self.request)
    
    if not hanja_path:
      return Response({
        "error": "Could not find path."
      }, status=status.HTTP_404_NOT_FOUND)

    path_length = len(hanja_path)

    first = hanja_path[0]["step_character"]["character"]
    start_from = random.choice([char for char in hanja_path[0]["example_word"]["origin"] 
                               if char != first and ord(char) >= 0x4e00 and ord(char) <= 0x9fff])
    go_to = hanja_path[path_length - 1]["step_character"]["character"]

    # number of required words and characters.
    num_requirements = path_length // 4
    
    required_characters = []
    selected = random.sample(hanja_path[1:-1], k=num_requirements)

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

    for i in range(0, num_requirements):
      required_characters.append(random.sample(selected[i]["example_word"]["origin"], k=1))

    return Response({
      'start_from': HanjaCharacterSerializer(HanjaCharacter.objects.get(pk = start_from)).data,
      'go_to': HanjaCharacterSerializer(HanjaCharacter.objects.get(pk = go_to)).data,
      'supplied_characters': supplied_characters,
      'required_characters': required_characters,
      'hanja_path': hanja_path
    })

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
      return Response({'error': '분석할 입력어가 없습니다.'}, status=status.HTTP_400_BAD_REQUEST)

    user_known_words = request.user.known_words.all()

    try:
      analysis, _ = get_nouns_verbs(text)
    except Exception:
      return Response({'error': f'분석하면서 오류가 발생했습니다.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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
    