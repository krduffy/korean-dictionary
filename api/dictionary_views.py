
from rest_framework import status
from django.http import JsonResponse
from django.db.models import Case, When, Value, BooleanField, Q
from django.db.models.functions import StrIndex, Length
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from .dictionary_models import KoreanWord, HanjaCharacter
from .dictionary_serializers import *
from rest_framework.permissions import IsAuthenticated
import re
import copy

from .util import remove_all_user_additions, remove_non_user_additions, prioritize_known_or_studying, get_nouns_verbs

# Page size = 10
class PaginationClass(PageNumberPagination):
  page_size = 10

# Returns list of KoreanWords for given search_term query parameter.
class KoreanWordList(generics.ListAPIView):
  """
    API view to return a list of Korean words from a search term.
  
    Query Parameters:
        search_term (string, optional): The search term. Can contain _ or *, which are converted
        to . and .* respectively before the search term is matched against all words as a regular
        expression.
  """
  serializer_class = KoreanWordSerializer
  pagination_class = PaginationClass

  def get_queryset(self):
    queryset = None
    if self.request.user:
      queryset = remove_non_user_additions(KoreanWord.objects.all(), self.request.user.pk)
    else:
      queryset = remove_all_user_additions(KoreanWord.objects.all())

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
  """API view to view details for a Korean word from its pk."""
  serializer_class = KoreanWordDetailedSerializer

  def get_queryset(self):
    queryset = None
    if self.request.user:
      queryset = remove_non_user_additions(KoreanWord.objects.all(), self.request.user.pk)
    else:
      queryset = remove_all_user_additions(KoreanWord.objects.all())

    return queryset
  
class KoreanWordAnalyze(APIView):
  """
    API view to return the lemma for a given word in a given text. Can also return an incorrect lemma.

    POST body keys:
      - `text`: The full text.
      - `mouse_over`: The word from text whose lemma should be returned.

    Returns:
      A JSON dictionary containing:

      On Success:
        - `found`: The lemma corresponding to `mouse_over`.
        - `num_words`: The number of words the model found in `text`.
        - `analysis`: All of the lemmas the model found in `text`.
        
      On Failure:
        - `error`: The encountered error.
  """
  serializer_class = NLPRequestValidator
  # in this file because the user's data does not impact this. however, it will need to be
  # required to be turned on in settings
  permission_classes = (IsAuthenticated, )

  def post(self, request):

    # this is called to ensure that if something like 공자(孔子) the analysis will return
    # 孔子 instead of 공자 in general. Because there are so many 동음이의어 in korean, this
    # is more convenient for the user so that they do not have to scroll through results
    # to get to the correct one if the string itself specifies a hanja origin.
    def get_hanja_if_in_original(found_word, original_string):

      regex = r'\([\u4e00-\u9fff]+\)'
      pattern = re.compile(regex)

      match = pattern.search(original_string)
      if match:
        hanja_word = match.group()[1:-1]
        if KoreanWord.objects.filter(word__exact = found_word).filter(origin__exact = hanja_word).exists():
          return hanja_word
        return None

    print(request.data['text'])

    if not request.data['text']:
      return Response({'error': '분석할 글이 없습니다.'})
    elif not request.data['mouse_over']:
      return Response({'error': '분석할 단어를 제공하지 않았습니다.'})
    elif request.data['mouse_over'] not in request.data['text'].split():
      return Response({'error': '제공한 단어를 글에 찾을 수 없습니다.'})

    sentence = request.data['text']

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
      new_sentence_strings = copy.deepcopy(original_inner_strings)
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
          original_inner_strings[i] = found.group()[1:-1]
          new_sentence_strings[i] = new_sentence_strings[i].replace(found.group(), dummy_string + number_words[num_dummies])
          num_dummies += 1

      new_sentence = "".join(string for string in new_sentence_strings)

      (analysis, original) = get_nouns_verbs(new_sentence)
    else:
      (analysis, original) = get_nouns_verbs(sentence)

    mouse_over = request.data['mouse_over']

    # this is a heuristic but it is correct almost every time from testing
    # with sentence strings that contain hanja, very long sentences, several 조사 all
    # glued together, etc. If I find that it is unsatisfyingly inaccurate then I will make
    # changes but this feature of clicking on words will need to be toggled anyway ( there will
    # be a disclaimer about potential inaccuracies) so this is what I will be using for the time
    # being.
    if len(analysis) == len(sentence.split()):
      index_of_mouse_over = sentence.split().index(mouse_over)

      return_word = analysis[index_of_mouse_over][0]
      word_type = analysis[index_of_mouse_over][1]

      if needs_dummy and return_word.startswith(dummy_string):
        return_word = original_inner_strings[
          number_words.index(return_word.replace(dummy_string, ''))
        ]
      
      hanja = get_hanja_if_in_original(return_word, mouse_over)

      if hanja:
        return JsonResponse({'found': hanja, 'num_words': len(analysis), 'analysis': original})
      else:
        return JsonResponse({'found': return_word + "다" if not needs_dummy and word_type.startswith('V')
                            else return_word, 'num_words': len(analysis), 'analysis': original})
  
    # Usually only gets as a last resort. Verbs rarely found here because they never contain
    # '다' in the verb itself. However, there is another problem with changes such as 보다 ->
    # 봤어요 where even if it only checks that 봤어요 starts with 보, it will not be found because
    # things ending in ㅜ, ㅗ, ㅡ, ㅣ, etc often change to ㅝ, ㅘ, ㅓ, ㅕ. Additionally the ㅆ as 받침
    # makes finding verbs difficult here.

    # can also look for the longest string that matches so 원자량 matches 원자량 instead of 원자 etc
    for word in analysis:
      if mouse_over.startswith(word):
        hanja = get_hanja_if_in_original(word[0], mouse_over)

        if hanja:
          return JsonResponse({'found': hanja, 'num_words': len(analysis), 'analysis': original})
        else:
          return JsonResponse({'found': word[0] + "다" if word[1].startswith('V') else word[0],
                              'num_words': len(analysis), 'analysis': original})

    return JsonResponse({'errors': '해당 단어를 찾을 수 없습니다.', 'nss': new_sentence_strings
        , 'num_words': len(analysis), 'analysis': original}, status=status.HTTP_404_NOT_FOUND)

# TODO hide nonuser senses
# TODO incorporate this 2 sense views below with related words in korean detail. 
# this is not called.
class SenseList(generics.ListAPIView):
  serializer_class = SenseSerializer

  def get_queryset(self):
    raise NotImplementedError('cannot find sense list.')


# Returns a list of HanjaCharacters for a given search_term query parameter.
class HanjaList(generics.ListAPIView):
  """
    API view to return a list of Hanja characters from a search term.
  
    Query Parameters:
        search_term (string, optional): The search term.
  """
  serializer_class = HanjaCharacterSerializer
  pagination_class = PaginationClass

  def get_queryset(self):

    queryset = HanjaCharacter.objects.all()
    
    # Search term is korean, hanja, or both but even 1 hanja just
      # makes the whole search into a search of the Hanja dictionary.
    search_term = self.request.query_params.get('search_term', '')
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
      return queryset.order_by("-is_reading", "-result_ranking", "strokes", "character")
    
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
      return queryset.order_by("order", "-result_ranking", "strokes", "character")
  
# Returns all data associated with a HanjaCharacter given a primary key.
class HanjaDetail(generics.RetrieveAPIView):
  """API view to view the details for a hanja character from its pk."""
  queryset = HanjaCharacter.objects.all()
  serializer_class = HanjaCharacterSerializer

class HanjaExamples(generics.ListAPIView):
  """API view to view a list of Korean words containing a given hanja character from the character's pk."""
  queryset = KoreanWord.objects.all()
  serializer_class = KoreanSerializerForHanja
  pagination_class = PaginationClass

  def get_queryset(self):
    character = self.request.query_params.get('character')

    queryset = None
    
    if self.request.user.is_authenticated:
      queryset = remove_non_user_additions(KoreanWord.objects.all(), allowed_user=self.request.user.pk)
      queryset = queryset.filter(origin__contains = character)
      queryset = prioritize_known_or_studying(queryset=queryset, user=self.request.user)
    else:
      queryset = remove_all_user_additions(KoreanWord.objects.all())
      queryset = queryset.filter(origin__contains = character)
    
    return queryset

  def get_serializer_context(self):
    context = super().get_serializer_context()
    context['request'] = self.request
    return context

# Returns the data shown when hovering over a Hanja character.  
class HanjaPopup(APIView):
  """API view to view the details for a hanja character shown when the character is hovered over."""

  # request and format are not used but this will break if they are removed.
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
      queryset = remove_non_user_additions(queryset=queryset, allowed_user=self.request.user.pk)
      queryset = prioritize_known_or_studying(queryset=queryset, user=self.request.user)
    else:
      queryset = remove_all_user_additions(queryset=queryset)
      queryset = queryset.order_by(Length("word").asc())

    queryset = queryset[:num_results]
    
    serialized_words = KoreanSerializerForHanja(queryset, many = True, context={'request': self.request}).data

    return Response({
      "meaning_reading": meaning_reading,
      "retrieved_words": len(serialized_words),
      "words": serialized_words,
    })