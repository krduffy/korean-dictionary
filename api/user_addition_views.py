from collections import defaultdict
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from .user_addition_models import UserNote
from .user_addition_serializers import UserNoteSerializer, UserSenseSerializer, UserWordSerializer
from .dictionary_models import HanjaCharacter, KoreanWord, Sense
from .dictionary_serializers import HanjaCharacterSerializer, KoreanWordSerializer, SenseSerializer, KoreanSerializerForHanja, HanjaGameWordSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
import random
import re

# Page size = 10
class PaginationClass(PageNumberPagination):
  page_size = 10

class CreateNoteView(APIView):
  permission_classes = (IsAuthenticated,)

  def post(self, request):
    serializer = UserNoteSerializer(data = request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateWordView(APIView):

  permission_classes = (IsAuthenticated, )

  def post(self, request):
    serializer = UserWordSerializer(data = request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CreateSenseView(APIView):
  permission_classes = (IsAuthenticated,)

  def post(self, request):
    serializer = UserSenseSerializer(data = request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateWordView(UpdateAPIView):
  permission_classes = (IsAuthenticated,)

  queryset = KoreanWord.objects.all()
  serializer_class = KoreanWordSerializer

class ToggleWordKnownView(APIView):
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
  permission_classes = (IsAuthenticated,)

  queryset = Sense.objects.all()
  serializer_class = SenseSerializer

class UpdateNoteView(UpdateAPIView):
  permission_classes = (IsAuthenticated,)

  queryset = UserNote.objects.all()
  serializer_class = UserNoteSerializer

class UserKnownWords(generics.ListAPIView):
  permission_classes = (IsAuthenticated, )
  serializer_class = KoreanWordSerializer
  pagination_class = PaginationClass

  def get_queryset(self):
    known_words = self.request.user.known_words.all()
    return known_words
  
class HomepageInfoView(APIView):
  permission_classes = (IsAuthenticated, )

  def get(self, request):
    # Returns
    # 1. Words with same hanja (as a "did you know?")
    # 2. Random words in the user's study list

    known_words = self.request.user.known_words.all().order_by('?')
    
    # can make variable number but having too many is information overload
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

    #TODO change this
    num_random_study_words = 0

    random_study_words = KoreanWordSerializer(
      self.request.user.study_words.all().order_by('?')[:num_random_study_words],
      many = True,
      context = {'request': request}) \
      .data

    return Response({
      'same_hanja': same_hanja_examples,
      'random_study_words': random_study_words,
    })

def get_path_of_length(request, length):
  # Finds a path that the user can take to solve the game.
    
    # get list of (only) hanja words that the user knows;
    # regex gets words with at least 2 characters
    regex = r'[\u4e00-\u9fff][\u4e00-\u9fff]'
    all_known_words = request.user.known_words.all().filter(origin__iregex = regex).order_by('?')

    hanja_path = []
    # Hanja path in the form of [[character, word to connect this], 
    # [next character, next word]] etc. So an example would be
    # [[力 힘 력, 전력], [電 번개 전, 축전지], [蓄 모을 축, 비축]] if the puzzle
    # was to get from 力 힘 력 to 備 갖출 비 and the number of steps was only 2

    step_characters = []
    tried_lists = defaultdict(list)
    step_word_origins = []

    step_counter = 0
    
    # in while true:
    # 1. filter all chars in step_characters and tried_lists out of the queryset
    # 2. get a word.
    #    if there is no word,
    #    backtrack:
    #       get rid of the last thing in step characters and instead add it to tried_lists at
    #       the index before
    # 3. get a character in the word that is not any of the ones in step_characters
    # 4. add that character to step_characters
    # 5. next cycle
    while True:
      
      if step_counter == 0:
        included_pattern = '.*'
      else:
        required = step_characters[step_counter - 1]
        banned = "".join(char for char in step_word_origins if char != required)

        included_pattern = \
          f'^[^{banned}]*' + \
          f'[{required}]' + \
          f'[^{banned}]*$'

      working_set = all_known_words.filter(origin__iregex = included_pattern)

      found_link = False

      for valid_word in working_set:
        # check this word for any valid link
        for character in valid_word.origin:
          if character not in tried_lists[step_counter] and character not in step_characters and HanjaCharacter.objects.filter(pk = character).exists():
            found_link = True
            #print('character is ', character)
            hanja_path.append({
              'step_character': HanjaCharacterSerializer(
                          HanjaCharacter.objects.get(pk = character)).data,
              'example_word': HanjaGameWordSerializer(
                          valid_word, context = {'request': request}).data,
              })
            step_characters.append(character)
            step_word_origins.append(valid_word.origin)
            step_counter += 1
            
            break # out of for character in valid_word

        if found_link:
          break # out of for valid_word in working_set
        else:
          for character in valid_word.origin:
            tried_lists[step_counter].append(character)

      # step_counter and list of characters already updated; dont need to do again
      if step_counter >= length:
        return hanja_path
      elif not found_link and step_counter != 0:
        #tried_lists[step_counter - 1].append(hanja_path[step_counter])
        #print('in heere; printing tried before and after update')
        #print(tried_lists[step_counter])
        for character in step_word_origins[step_counter - 1]:
          tried_lists[step_counter].append(character)
        #print(tried_lists[step_counter])
        step_counter -= 1
        step_characters.pop()
        step_word_origins.pop()
        hanja_path.pop()
      elif not found_link and step_counter == 0:
        break

    return None

class HanjaGameView(APIView):
  permission_classes = (IsAuthenticated, )

  def get(self, request):
    
    # if user doesnt know any words / fewer than a certain number send back a specific error response
    # if they know some but not many it can send a warning that the game will probably be
    # not as good as if they knew more words with hanja in

    # difficulty can only be 'desired'. it is not guaranteed because there is no way to know
    # which words the user specifically knows; it is possible for every attempt to create a good
    # path to be only 1 word long, in which case 
    length = int(self.request.query_params.get('length', 3))

    hanja_path = []

    # do the generation
    hanja_path = get_path_of_length(request, length=length)
    
    #TODO handle hanja_path is None

    path_length = len(hanja_path)

    first = hanja_path[0]["step_character"]["character"]
    start_from = random.choice([char for char in hanja_path[0]["example_word"]["kw_origin"] 
                               if char != first and ord(char) >= 0x4e00 and ord(char) <= 0x9fff])
    go_to = hanja_path[path_length - 1]["step_character"]["character"]

    # number of required words and characters.
    num_requirements = path_length // 4
    
    required_characters = []
    selected = random.sample(hanja_path[1:-1], k=num_requirements)

    supplied_characters = []
    for word_on_path in hanja_path:
      for character in word_on_path["example_word"]["kw_origin"]:
        if character not in supplied_characters:
          supplied_characters.append(character)

    num_supplied_characters = len(supplied_characters)
    num_supplied_needed = 16
    if num_supplied_characters < num_supplied_needed:
      regex = r'[\u4e00-\u9fff][\u4e00-\u9fff]'
      all_known_words = request.user.known_words.all().filter(origin__iregex = regex).order_by('?')
      index = 0

      while num_supplied_characters < num_supplied_needed:
        for character in all_known_words[index].origin:
          if ord(character) > 0x4e00 and ord(character) < 0x9fff and \
            character not in supplied_characters and num_supplied_characters < num_supplied_needed:
              num_supplied_characters += 1
              supplied_characters.append(character)
        index += 1

    random.shuffle(supplied_characters)

    for i in range(0, num_requirements):
      required_characters.append(random.sample(selected[i]["example_word"]["kw_origin"], k=1))

    return Response({
      'start_from': HanjaCharacterSerializer(HanjaCharacter.objects.get(pk = start_from)).data,
      'go_to': HanjaCharacterSerializer(HanjaCharacter.objects.get(pk = go_to)).data,
      'supplied_characters': supplied_characters,
      'required_characters': required_characters,
      'hanja_path': hanja_path
    })