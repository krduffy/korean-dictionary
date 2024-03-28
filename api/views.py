
from django.http import HttpResponse
from django.db.models import Case, When, Value, BooleanField
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from . models import KoreanWord, Sense, HanjaCharacter
from . serializers import *

class PaginationClass(PageNumberPagination):
  page_size = 10

class WordList(generics.ListAPIView):
  serializer_class = KoreanWordSerializer
  pagination_class = PaginationClass

  def get_queryset(self):
    queryset = KoreanWord.objects.all()

    search_type = self.request.query_params.get('search_type', 'exact')
    search_term = self.request.query_params.get('search_term', '')
    
    if search_type == 'exact':
      queryset = queryset.filter(word = search_term)
    elif search_type == 'startswith':
      queryset = queryset.filter(word__startswith = search_term)
    return queryset
  
class WordDetail(generics.RetrieveAPIView):
  queryset = KoreanWord.objects.all()
  serializer_class = KoreanWordDetailedSerializer

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

class HanjaList(generics.ListAPIView):
  serializer_class = HanjaCharacterSerializer
  pagination_class = PaginationClass

  def get_queryset(self):
    queryset = HanjaCharacter.objects.all()
    
    # Search term is korean, hanja, or both
    search_term = self.request.query_params.get('search_term')
    input_language = self.request.query_params.get('input_language')

    if search_term is not None and input_language == "kor":
      queryset = queryset.filter(meaning_reading__contains = search_term)

      if len(search_term) != 1:
        return queryset
      
      # if length is 1, move results where this is the reading (always exactly 1 character) instead
      # of a substring of the meaning (can be 2+ characters); almost all of the time this is what 
      # users would intend when inputting a single korean character (syllable block)
      queryset = queryset.annotate(
        is_reading = Case(
          When(meaning_reading__iregex = r'(?<!,)\s' + search_term, then = Value(True)),
          default = Value(False),
          output_field=BooleanField(),
        )
      )
      return queryset.order_by('-is_reading')
    
    elif search_term is not None and input_language == "han":
      queryset = queryset.filter(character__icontains = search_term)
      return queryset
  
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
    return queryset.filter(origin__icontains = character)
    # TODO have user as query param