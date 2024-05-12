
from django.http import HttpResponse
from django.db.models import Case, When, Value, BooleanField, Q
from django.db.models.functions import StrIndex, Length
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from .dictionary_models import KoreanWord, Sense, HanjaCharacter
from .dictionary_serializers import *

# Page size = 10
class PaginationClass(PageNumberPagination):
  page_size = 10

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
    #return queryset.order_by("-is_known")
    return queryset
  
# Returns all data associated with a KoreanWord given a primary key.
class KoreanWordDetail(generics.RetrieveAPIView):
  queryset = KoreanWord.objects.all()
  serializer_class = KoreanWordDetailedSerializer

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
    queryset = queryset.order_by(Length("word").asc())
    # TODO have user as query param
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

    #TODO include user as a query param
    num_results = 10
    queryset = KoreanWord.objects.all()
    queryset = queryset.filter(origin__contains = character)
    queryset = queryset.order_by(Length("word").asc())[:num_results]

    serialized_words = KoreanSerializerForHanja(queryset, many = True).data

    return Response({
      "meaning_reading": meaning_reading,
      "retrieved_words": len(serialized_words),
      "words": serialized_words,
    })