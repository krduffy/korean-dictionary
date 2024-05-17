
from rest_framework import status
from django.http import JsonResponse
from django.db.models import Case, When, Value, BooleanField, Q
from django.db.models.functions import StrIndex, Length
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from .dictionary_models import KoreanWord, Sense, HanjaCharacter
from .dictionary_serializers import *
from rest_framework.permissions import IsAuthenticated
import re

# nlp
from konlpy.tag import Kkma

# Page size = 10
class PaginationClass(PageNumberPagination):
  page_size = 10

# have not tested yet
def ignore_other_user_words(queryset, user):

  return queryset.annotate(
      user_or_default = Case(
          When(creator=None, then=Value(True)),
          When(creator=user, then=Value(True)),
          default=Value(False),
          output_field=BooleanField(),
      )
  ).filter("user_or_default")

def prioritize_known_or_studying(queryset, user):
  known_words = user.known_words.all()
  study_words = user.study_words.all()

  new_queryset = None

  if known_words.exists() or study_words.exists():
      new_queryset = queryset.annotate(
          prioritized=Case(
              When(target_code__in=known_words, then=Value(True)),
              When(target_code__in=study_words, then=Value(True)),
              default=Value(False),
              output_field=BooleanField(),
          ),
          length=Length("word")
      ).order_by("-prioritized", "length", "target_code")

  return new_queryset if new_queryset else queryset

# Returns list of KoreanWords for given search_term query parameter.
class KoreanWordList(generics.ListAPIView):
  serializer_class = KoreanWordSerializer
  pagination_class = PaginationClass

  def get_queryset(self):
    queryset = KoreanWord.objects.all()

    search_term = self.request.query_params.get('search_term', '')
    
    # Called when the user searches something in the search box, which only
    # allows for a limited charset.
    # If search_term contains any Hanja character, this view will return a list containing
    # any words (usually either 0 or 1) with an origin exactly matching the input.
    # Otherwise, converts inputs with _ or * to regex patterns (_ -> . and * -> .*)
    # and searches the Korean dictionary using regex matching. For example, a search term 
    # of '_력*' will be converted to the regex /^.력.*$/
    
    input_language = "kor"
    for character in search_term:
      if ord(character) >= 0x4e00 and ord(character) <= 0x9fff:
        input_language = "han"
        break

    if input_language == "han":
      queryset = queryset.filter(origin__exact = search_term)
      return queryset
    
    # Word is not hanja input
    regized_search_term = '^'
    regized_search_term += search_term.replace('_', '.').replace('*', '.*')
    regized_search_term += '$'

    queryset = queryset.filter(word__iregex = regized_search_term)
    queryset = queryset.order_by(Length("word").asc())

    if self.request.user.is_authenticated:
      return prioritize_known_or_studying(queryset=queryset, user=self.request.user)
    return queryset
  
# Returns all data associated with a KoreanWord given a primary key.
class KoreanWordDetail(generics.RetrieveAPIView):
  queryset = KoreanWord.objects.all()
  serializer_class = KoreanWordDetailedSerializer

def get_nouns_verbs(sentence):

  def noun_or_verb_or_det(str):
    return str.startswith("N") or str.startswith("V") or str.startswith("M") or str.startswith("XR") or str == 'OL'
  
  def is_verb(str):
    return str.startswith("V")

  kkma = Kkma()
  analysis = kkma.pos(sentence)

  delete_non = [item for item in analysis if noun_or_verb_or_det(item[1])]
  return ([item[0] + "다" if is_verb(item[1]) else item[0] for item in delete_non],
          analysis)
  
class KoreanWordAnalyze(APIView):
  serializer_class = NLPRequestValidator
  # in this file because the user's data does not impact this. however, it will need to be
  # required to be turned on in settings
  permission_classes = (IsAuthenticated, )

  def post(self, request):

    serializer = self.serializer_class(data=request.data)

    if serializer.is_valid(raise_exception=True):

      sentence = serializer.validated_data['sentence']

      original_inner_strings = sentence.split()
      new_sentence_strings = original_inner_strings

      delimiting_pairs = [('‘', '’')]
      regex = '|'.join(f'(?:{re.escape(start)}' + r'[^\s]' + f'+?{re.escape(end)})'
                       for start, end in delimiting_pairs)
      pattern = re.compile(regex)

      (analysis, original) = ([], [])

      needs_dummy = pattern.match(sentence)

      if needs_dummy:

        original_inner_strings = sentence.split()
        new_sentence_strings = original_inner_strings
        # this dummy string will get tagged as OL (other language).
        # thus, I check if a thing to be returned starts with this string
        # if it does, we will instead return the original string.
        # This is necessary because the model cannot handle things like
        # '\'살다\'의 피동사' well due to the apostrophes. However, these kinds of
        # definitions are so common that it is beneficial to have this additional
        # line of defense against returning no string
        dummy_string = 'Kieran'
        number_words = ['zero', 'one', 'two', 'three', 'four', 'five']
        num_dummies = 0
        
        for i in range(0, len(original_inner_strings)):
          found = pattern.match(original_inner_strings[i])
          if found:
            new_sentence_strings[i].replace(found.group(), dummy_string + number_words[num_dummies])
            num_dummies += 1

        new_sentence = "".join(string for string in new_sentence_strings)

        (analysis, original) = get_nouns_verbs(new_sentence)
      else:
        (analysis, original) = get_nouns_verbs(sentence)

      mouse_over = serializer.validated_data['mouse_over']

      # this is a heuristic but it is correct almost every time from testing
      # with sentence strings that contain hanja, very long sentences, several 조사 all
      # glued together, etc. If I find that it is unsatisfyingly inaccurate then I will make
      # changes but this feature of clicking on words will need to be toggled anyway ( there will
      # be a disclaimer about potential inaccuracies) so this is what I will be using for the time
      # being.
      if len(analysis) == len(sentence.split()):
        index_of_mouse_over = sentence.split().index(mouse_over)
        to_return = analysis[index_of_mouse_over]
        if needs_dummy and to_return.startswith(dummy_string):
          to_return = original_inner_strings[
            number_words.index(to_return.replace(dummy_string, ''))
          ]
        
        return JsonResponse({'found': analysis[index_of_mouse_over], 'num_words': len(analysis), 'analysis': original})
    
      # Usually only gets as a last resort. Verbs rarely found here because they never contain
      # '다' in the verb itself. However, there is another problem with changes such as 보다 ->
      # 봤어요 where even if it only checks that 봤어요 starts with 보, it will not be found because
      # things ending in ㅜ, ㅗ, ㅡ, ㅣ, etc often change to ㅝ, ㅘ, ㅓ, ㅕ. Additionally the ㅆ as 받침
      # makes finding verbs difficult here.

      # can also look for the longest string that matches so 원자량 matches 원자량 instead of 원자 etc
      for word in analysis:
        if mouse_over.startswith(word):
          return JsonResponse({'found': word, 'num_words': len(analysis), 'analysis': original})

      return JsonResponse({'errors': '해당 단어를 찾을 수 없습니다.', 'num_words': len(analysis), 'analysis': original},
                          status=status.HTTP_404_NOT_FOUND)
    
    else:
      return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# TODO hide nonuser senses
# TODO incorporate this 2 sense views below with related words in korean detail. 
class SenseList(generics.ListAPIView):
  serializer_class = SenseSerializer

  def get_queryset(self):
    queryset = Sense.objects.all()
    tc = self.request.query_params.get('tc')
    if tc is not None:
      queryset = queryset.filter(target_code = tc)
    return queryset
  
class SenseDetail(generics.RetrieveUpdateDestroyAPIView):
  serializer_class = SenseSerializer
  queryset = Sense.objects.all()

# Returns a list of HanjaCharacters for a given search_term query parameter.
class HanjaList(generics.ListAPIView):
  serializer_class = HanjaCharacterSerializer
  pagination_class = PaginationClass

  def get_queryset(self):
    queryset = HanjaCharacter.objects.all()
    
    # Search term is korean, hanja, or both but even 1 hanja just
      # makes the whole search into a search of the Hanja dictionary.
    search_term = self.request.query_params.get('search_term')
    input_language = "kor"
    for character in search_term:
      if ord(character) >= 0x4e00 and ord(character) <= 0x9fff:
        input_language = "han"
        break

    if search_term is not None and input_language == "kor":
      queryset = queryset.filter(meaning_reading__contains = search_term)

      if len(search_term) != 1:
        return queryset
      
      # if length is 1, move results where this is the reading (always exactly 1 character) instead
      # of a substring of the meaning (1+ characters) to the front of the queryset; almost 
      # all of the time this is what users would intend when inputting a single korean 
      # character (syllable block)
      queryset = queryset.annotate(
        is_reading = Case(
          When(meaning_reading__iregex = r'(?<!,)\s' + search_term, then = Value(True)),
          default = Value(False),
          output_field=BooleanField(),
        )
      )
      return queryset.order_by("-is_reading")
    
    elif search_term is not None and input_language == "han":

      # Filters out any characters that are not in search_term.
      # Note that len(search_term) > 1 because if it is 1 then the app
      # will instead issue a get request to HanjaDetail (below). This is to
      # make searches where the user clearly wants data for a single character
      # automatically render a more detailed view and eliminate the extra click
      # otherwise required. A query with search_term '頭痛' will filter out every
      # character except for those 2.
      individual_char_queries = [Q(character__icontains=char) for char in search_term]
      has_any_char = individual_char_queries[0]
      for query in individual_char_queries:
        has_any_char = has_any_char | query
      queryset = queryset.filter(has_any_char)

      # Orders the queryset according to where the characters actually are in search_term.
      # Prevents the order of the queryset for search_term '頭痛' from being the second
      # character, then the first.
      queryset = queryset.annotate(
        order = StrIndex(Value(search_term), "character")
      )
      return queryset.order_by("order")
  
# Returns all data associated with a HanjaCharacter given a primary key.
class HanjaDetail(generics.RetrieveAPIView):
  queryset = HanjaCharacter.objects.all()
  serializer_class = HanjaCharacterSerializer

class HanjaExamples(generics.ListAPIView):
  queryset = KoreanWord.objects.all()
  serializer_class = KoreanSerializerForHanja
  pagination_class = PaginationClass

  def get_queryset(self):
    character = self.request.query_params.get('character')

    queryset = KoreanWord.objects.all()
    queryset = queryset.filter(origin__contains = character)
    if self.request.user.is_authenticated:
      queryset = prioritize_known_or_studying(queryset=queryset, user=self.request.user)
    
    return queryset

# Returns the data shown when hovering over a Hanja character.  
class HanjaPopup(APIView):

  def get(self, request, format=None):
    character = self.request.query_params.get('character')
    meaning_reading = None
    try:
      hanja_char = HanjaCharacter.objects.get(character=character)
      meaning_reading = hanja_char.meaning_reading
    except HanjaCharacter.DoesNotExist:
      meaning_reading = None

    num_results = 10
    queryset = KoreanWord.objects.all()
    queryset = queryset.filter(origin__contains = character)
    
    if self.request.user.is_authenticated:
      queryset = prioritize_known_or_studying(queryset=queryset, user=self.request.user)
    else:
      queryset = queryset.order_by(Length("word").asc())
    queryset = queryset[:num_results]
    
    serialized_words = KoreanSerializerForHanja(queryset, many = True).data

    return Response({
      "meaning_reading": meaning_reading,
      "retrieved_words": len(serialized_words),
      "words": serialized_words,
    })