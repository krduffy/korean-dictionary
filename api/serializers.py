from rest_framework import serializers
from . models import KoreanWord, Sense, HanjaCharacter

class KoreanWordSerializer(serializers.ModelSerializer):
  kw_target_code = serializers.IntegerField(source='target_code', default = None)
  kw_word = serializers.CharField(source='word', default = None)
  kw_origin = serializers.CharField(source='origin', default = None)
  kw_word_type = serializers.CharField(source='word_type', default = None)
  kw_senses = serializers.SerializerMethodField()
  
  class Meta:
    model = KoreanWord
    fields = ['kw_target_code', 'kw_word', 'kw_origin', 'kw_word_type', 'kw_senses']
    read_only_fields = ['__all__']

  def get_kw_senses(self, obj):
    first_five = obj.senses.all().order_by('order')[:5]
    sense_serializer = SimplifiedSenseSerializer(first_five, many=True)
    return sense_serializer.data

class KoreanWordDetailedSerializer(serializers.ModelSerializer):
  senses = serializers.SerializerMethodField()

  class Meta:
    model = KoreanWord
    fields = ('__all__')
    read_only_fields = ['__all__']

  def get_senses(self, obj):
    senses = obj.senses.all().order_by('order')
    sense_serializer = SenseSerializer(senses, many = True)
    return sense_serializer.data

class SimplifiedSenseSerializer(serializers.ModelSerializer):

  s_target_code = serializers.IntegerField(source='target_code', default = None)
  s_definition = serializers.CharField(source='definition', default = None)
  s_type = serializers.CharField(source='type', default = None)
  s_order = serializers.IntegerField(source='order', default = None)
  s_category = serializers.CharField(source='category', default = None)
  s_pos = serializers.CharField(source='pos', default = None)

  class Meta:
    model = Sense
    fields = ['s_target_code', 's_definition', 's_type', 's_order', 
              's_category', 's_pos']
    read_only_fields = ['__all__']

class SenseSerializer(serializers.ModelSerializer):
  
  class Meta:
    model = Sense
    fields = '__all__'
    read_only_fields = ['__all__']

class HanjaCharacterSerializer(serializers.ModelSerializer):
  class Meta:
    model = HanjaCharacter
    fields = ('__all__')
