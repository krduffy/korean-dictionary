from rest_framework import serializers
from . models import KoreanWord, Sense, HanjaCharacter

class KoreanWordSerializer(serializers.ModelSerializer):
  word_target_code = serializers.IntegerField(source='KoreanWord.target_code', default = None)
  word_word = serializers.CharField(source='KoreanWord.word', default = None)
  
  class Meta:
    model = KoreanWord
    fields = ['word_target_code', 'word_word'] # can have multiple serializers bc of this
    read_only_fields = ['__all__']

class SenseSerializer(serializers.ModelSerializer):
  sense_target_code = serializers.IntegerField(source='Sense.target_code', default = None)
  sense_def = serializers.CharField(source='Sense.definition', default = None)
  
  class Meta:
    model = Sense
    fields = ['sense_target_code', 'sense_definition']
    read_only_fields = ['__all__']

class HanjaCharacterSerializer(serializers.ModelSerializer):
  class Meta:
    model = HanjaCharacter
    fields = ('__all__')
