
from django.http import HttpResponse
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
  serializer_class = KoreanWordDetailedSerializer
  
  def retrieve(self, request, *args, **kwargs):
    target_code = self.kwargs.get('target_code', None)
        
    if target_code is not None:
        # Retrieve the KoreanWord object based on its primary key (target_code)
        try:
            instance = KoreanWord.objects.get(target_code=target_code)
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except KoreanWord.DoesNotExist:
            return Response({"error": "KoreanWord not found"}, status=404)
    else:
        return Response({"error": "You must specify a target_code"}, status=400)

class SenseList(generics.ListCreateAPIView):
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

class HanjaList(generics.ListCreateAPIView):
  serializer_class = HanjaCharacterSerializer

  def get_queryset(self):
    queryset = HanjaCharacter.objects.all()
    char = self.request.query_params.get('character')
    if char is not None:
      queryset = queryset.filter(character = char)
    return queryset
  
class HanjaDetail(generics.RetrieveUpdateDestroyAPIView):
  serializer_class = HanjaCharacterSerializer
  queryset = HanjaCharacter.objects.all()