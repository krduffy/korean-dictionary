
from rest_framework import generics
from . models import KoreanWord, Sense, HanjaCharacter
from . serializers import KoreanWordSerializer, SenseSerializer, HanjaCharacterSerializer

class WordList(generics.ListCreateAPIView):
  serializer_class = KoreanWordSerializer

  def get_queryset(self):
    queryset = KoreanWord.objects.all()
    tc = self.request.query_params.get('target_code')
    if tc is not None:
      queryset = queryset.filter(target_code = tc)
    return queryset
  
class WordDetail(generics.RetrieveUpdateDestroyAPIView):
  serializer_class = KoreanWordSerializer
  queryset = KoreanWord.objects.all()

class SenseList(generics.ListCreateAPIView):
  serializer_class = SenseSerializer

  def get_queryset(self):
    queryset = Sense.objects.all()
    tc = self.request.query_params.get('target_code')
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