from rest_framework import serializers
from . models import KoreanWord, Sense, HanjaCharacter

class KoreanWordSerializer(serializers.ModelSerializer):
  class Meta:
    model = KoreanWord
    fields = ('__all__') # can have multiple serializers bc of this

class SenseSerializer(serializers.ModelSerializer):
  class Meta:
    model = Sense
    fields = ('__all__')

class HanjaCharacterSerializer(serializers.ModelSerializer):
  class Meta:
    model = HanjaCharacter
    fields = ('__all__')
