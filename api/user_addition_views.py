from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from .user_addition_models import UserNote
from .user_addition_serializers import UserNoteSerializer, UserSenseSerializer, UserWordSerializer
from .dictionary_models import HanjaCharacter, KoreanWord, Sense
from .dictionary_serializers import HanjaCharacterSerializer, KoreanWordSerializer, SenseSerializer, KoreanSerializerForHanja
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
import random

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

  def post(self, request, pk, format=None):
    try:
      korean_word = KoreanWord.objects.get(pk = pk)
      user = request.user

      user.known_words.add(korean_word)
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

  def get(self, request):
    known_words = self.request.user.known_words.all()
    serializer = KoreanWordSerializer(known_words, many=True, context = {'request': request})
    return Response(serializer.data)
  
class HomepageInfoView(APIView):
  permission_classes = (IsAuthenticated, )

  def get(self, request):
    # Returns
    # 1. Words with same hanja (as a "did you know?")
    # 2. Random words in the user's study list

    known_words = self.request.user.known_words.all().order_by('?')
    
    num_same_hanja_examples = 5
    i = 0
    retrieved = 0
    same_hanja_examples = []
    selected_hanja_chars = []

    while retrieved < num_same_hanja_examples:
      try:
        for character in known_words[i].origin:
          if ord(character) >= 0x4e00 and ord(character) <= 0x9fff and character not in selected_hanja_chars:
            first_two = known_words.filter(origin__contains = character)[:2]
            if len(first_two) < 2:
              continue
            else:
              retrieved = retrieved + 1
              selected_hanja_chars.append(character)
              same_hanja_examples.append(KoreanWordSerializer(first_two, many = True, context = {'request': request}).data)
        i = i + 1
      except IndexError:
        break

    random_study_words = KoreanWordSerializer(
      self.request.user.study_words.all().order_by('?')[:5], \
      many = True, \
      context = {'request': request}) \
      .data


    return Response({
      'same_hanja': same_hanja_examples,
      'random_study_words': random_study_words,
    })

def get_unused_char_in_word(word_origin, already_used, must_contain):
    # Returns none if the word is not viable for the hanja game
    # Else returns a character that can be used for step (since it
    # has not yet been used for a step in the game)
    if must_contain is not None and must_contain not in word_origin:
      return None
    
    if len(word_origin) < 2:
      return None
    
    # currently filters out anything that is not a pure sinokorean word
    for character in word_origin:
      if ord(character) < 0x4e00 or ord(character) > 0x9fff:
        return None
      
    unused = None

    while unused is None or unused in already_used:
      unused = random.choice(word_origin)

    return unused

class HanjaGameView(APIView):
  permission_classes = (IsAuthenticated, )

  def get(self, request):
    # Finds a path that the user will need to take to solve the game.
    # Also functions as an example solution in the case that the user gives up.
    
    known_words = self.request.user.known_words.all().order_by('?')
    hanja_path = []
    # Hanja path in the form of [[character, word to connect this], 
    # [next character, next word]] etc. So an example would be
    # [[力 힘 력, 전력], [電 번개 전, 축전지], [蓄 모을 축, 비축]] if the puzzle
    # was to get from 力 힘 력 to 備 갖출 비 and the number of steps was only 2

    step_characters = []
    step_word_origins = []

    num_steps = 2
    steps_taken = 0
    i = 0
    while steps_taken < num_steps:
      while True:
        try:
          word = known_words[i]
        except IndexError:
          # in this case, there just is not a path long enough.
          return Response({
            'path': hanja_path
          })
        
        if word.origin in step_word_origins:
          continue

        unused_char = get_unused_char_in_word(word.origin,
                                              already_used=step_characters,
                                              must_contain=
                                              step_characters[steps_taken - 1] if steps_taken > 0 else None)
        if unused_char is not None:

          hanja_path.append({
            'step_character': HanjaCharacterSerializer(
                        HanjaCharacter.objects.get(pk = unused_char)).data,
            'example_word': KoreanSerializerForHanja(
                        word, context = {'request': request}).data,
          })
          step_characters.append(unused_char)
          step_word_origins.append(word.origin)
          steps_taken = steps_taken + 1
          break

        i = i + 1
        

    return Response({
      'path': hanja_path
    })