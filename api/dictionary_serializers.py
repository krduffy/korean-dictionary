from rest_framework import serializers
from .dictionary_models import KoreanWord, Sense, HanjaCharacter

class KoreanWordSerializer(serializers.ModelSerializer):
  kw_target_code = serializers.IntegerField(source='target_code', default = None)
  kw_word = serializers.CharField(source='word', default = None)
  kw_origin = serializers.CharField(source='origin', default = None)
  kw_word_type = serializers.CharField(source='word_type', default = None)
  kw_senses = serializers.SerializerMethodField()
  kw_is_known = serializers.BooleanField(source='is_known')
  kw_created_by_user = serializers.BooleanField(source='created_by_user')

  class Meta:
    model = KoreanWord
    fields = ['kw_target_code', 'kw_word', 'kw_origin', 'kw_word_type', 
              'kw_senses', 'kw_is_known', 'kw_created_by_user']
    read_only_fields = ['__all__']

  def get_kw_senses(self, obj):
    # filter out whenever order is greater than 0 to eliminate
    # dummy senses used just for keeping examples. (which are saved as order=0)
    first_five = obj.senses.all().filter(order__gt = 0).order_by('order')[:5]
    sense_serializer = SimplifiedSenseSerializer(first_five, many=True)
    return sense_serializer.data

class KoreanWordDetailedSerializer(serializers.ModelSerializer):
  senses = serializers.SerializerMethodField()

  class Meta:
    model = KoreanWord
    fields = ('__all__')
    read_only_fields = ['target_code', 'word', 'origin', 'word_type', 'senses']

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
  s_created_by_user = serializers.BooleanField(source='created_by_user')

  class Meta:
    model = Sense
    fields = ['s_target_code', 's_definition', 's_type', 's_order', 
              's_category', 's_pos', 's_created_by_user']
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
    read_only_fields = ['__all__']

class KoreanSerializerForHanja(serializers.ModelSerializer):
  kw_target_code = serializers.IntegerField(source='target_code', default = None)
  kw_word = serializers.CharField(source='word', default = None)
  kw_origin = serializers.CharField(source='origin', default = None)
  kw_first_definition = serializers.SerializerMethodField()

  class Meta:
    model = KoreanWord
    fields = ['kw_target_code', 'kw_word', 'kw_origin', 'kw_first_definition']
    read_only_fields = ['__all__']

  def get_kw_first_definition(self, obj):
    first = obj.senses.all().order_by('order')[0]
    return first.definition