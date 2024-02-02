from rest_framework import serializers
from . models import KoreanWord, Sense, HanjaCharacter

class KoreanWordSerializer(serializers.ModelSerializer):
  kw_target_code = serializers.IntegerField(source='target_code', default = None)
  kw_word = serializers.CharField(source='word', default = None)
  kw_origin = serializers.CharField(source='origin', default = None)
  kw_word_type = serializers.CharField(source='word_type', default = None)
  kw_first_sense_def = serializers.SerializerMethodField()
  kw_first_sense_cat = serializers.SerializerMethodField()
  kw_first_sense_tc = serializers.SerializerMethodField()
  
  class Meta:
    model = KoreanWord
    fields = ['kw_target_code', 'kw_word', 'kw_origin', 'kw_word_type', 
              'kw_first_sense_def', 'kw_first_sense_cat', 'kw_first_sense_tc']
    read_only_fields = ['__all__']

  def get_kw_first_sense_def(self, obj):
    first_sense_def = obj.senses.filter(order = 1)
    return first_sense_def[0].definition if first_sense_def else None
  
  def get_kw_first_sense_cat(self, obj):
    first_sense_cat = obj.senses.filter(order = 1)
    return first_sense_cat[0].category if first_sense_cat else None
  
  def get_kw_first_sense_tc(self, obj):
    first_sense_tc = obj.senses.filter(order = 1)
    return first_sense_tc[0].target_code if first_sense_tc else None

class KoreanWordDetailedSerializer(serializers.ModelSerializer):
  senses = serializers.SerializerMethodField()

  class Meta:
    model = KoreanWord
    fields = ('__all__')
    read_only_fields = ['__all__']

  def get_senses(self, obj):
    senses = obj.senses.all()
    sense_serializer = SenseSerializer(senses, many = True)
    return sense_serializer.data

class SenseSerializer(serializers.ModelSerializer):
  sense_target_code = serializers.IntegerField(source='target_code', default = None)
  sense_def = serializers.CharField(source='definition', default = None)
  
  class Meta:
    model = Sense
    fields = '__all__'
    read_only_fields = ['__all__']

class HanjaCharacterSerializer(serializers.ModelSerializer):
  class Meta:
    model = HanjaCharacter
    fields = ('__all__')
