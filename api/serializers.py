from rest_framework import serializers
from . models import KoreanWord, Sense, HanjaCharacter

class KoreanWordSerializer(serializers.ModelSerializer):
  kw_target_code = serializers.IntegerField(source='target_code', default = None)
  kw_word = serializers.CharField(source='word', default = None)
  kw_origin = serializers.CharField(source='origin', default = None)
  kw_word_type = serializers.CharField(source='word_type', default = None)
  kw_first_sense_def = serializers.SerializerMethodField()
  kw_first_sense_cat = serializers.SerializerMethodField()
  
  class Meta:
    model = KoreanWord
    fields = ['kw_target_code', 'kw_word', 'kw_origin', 'kw_word_type', 
              'kw_first_sense_def', 'kw_first_sense_cat']
    read_only_fields = ['__all__']

  def get_kw_first_sense_def(self, obj):
    first_sense_def = obj.senses.filter(order = 1)
    return first_sense_def[0].definition if first_sense_def else None
  
  def get_kw_first_sense_cat(self, obj):
    first_sense_cat = obj.senses.filter(order = 1)
    return first_sense_cat[0].definition if first_sense_cat else None

class SenseSerializer(serializers.ModelSerializer):
  sense_target_code = serializers.IntegerField(source='target_code', default = None)
  sense_def = serializers.CharField(source='definition', default = None)
  
  class Meta:
    model = Sense
    fields = ['sense_target_code', 'sense_definition']
    read_only_fields = ['__all__']

class HanjaCharacterSerializer(serializers.ModelSerializer):
  class Meta:
    model = HanjaCharacter
    fields = ('__all__')
