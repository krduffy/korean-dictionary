from rest_framework import serializers

from api.util import remove_all_user_additions, remove_non_user_additions
from .dictionary_models import KoreanWord, Sense, HanjaCharacter

class KoreanWordSerializer(serializers.ModelSerializer):
  kw_target_code = serializers.IntegerField(source='target_code', default = None)
  kw_word = serializers.CharField(source='word', default = None)
  kw_origin = serializers.CharField(source='origin', default = None)
  kw_word_type = serializers.CharField(source='word_type', default = None)
  kw_senses = serializers.SerializerMethodField()
  kw_user_data = serializers.SerializerMethodField()

  class Meta:
    model = KoreanWord
    fields = ['kw_target_code', 'kw_word', 'kw_origin', 'kw_word_type', 
              'kw_senses', 'kw_user_data']
    read_only_fields = ['__all__']

  def get_kw_user_data(self, obj):
    sr_user = self.context['request'].user

    if sr_user.is_authenticated:
      user_data = dict()
      user_data['kw_is_known'] = sr_user.known_words.filter(pk = obj.target_code).exists()
      user_data['kw_is_studied'] = sr_user.study_words.filter(pk = obj.target_code).exists()
      user_data['kw_added_by_user'] = KoreanWord.objects.get(pk = obj.target_code).creator == sr_user
      return user_data

    return None

  def get_kw_senses(self, obj):
    # filter out whenever order is greater than 0 to eliminate
    # dummy senses used just for keeping examples. (which are saved as order=0)
    sense_queryset = obj.senses.all()
    if self.context['request'].user.is_authenticated:
      sense_queryset = remove_non_user_additions(queryset=sense_queryset, allowed_user=self.context['request'].user.pk)
    else:
      sense_queryset = remove_all_user_additions(queryset=sense_queryset)

    first_five = sense_queryset.filter(order__gt = 0).order_by('order')[:5]
    sense_serializer = SimplifiedSenseSerializer(first_five, many=True)
    return sense_serializer.data

class KoreanWordDetailedSerializer(serializers.ModelSerializer):
  senses = serializers.SerializerMethodField()
  user_data = serializers.SerializerMethodField()

  class Meta:
    model = KoreanWord
    fields = '__all__'
    read_only_fields = ['__all__']

  def get_user_data(self, obj):
    sr_user = self.context['request'].user

    if sr_user.is_authenticated:
      user_data = dict()
      user_data['is_known'] = sr_user.known_words.filter(pk = obj.target_code).exists()
      user_data['is_studied'] = sr_user.study_words.filter(pk = obj.target_code).exists()
      user_data['added_by_user'] = KoreanWord.objects.get(pk = obj.target_code).creator == sr_user
      return user_data

    return None

  def get_senses(self, obj):
    sense_queryset = obj.senses.all()
    if self.context['request'].user.is_authenticated:
      sense_queryset = remove_non_user_additions(queryset=sense_queryset, allowed_user=self.context['request'].user.pk)
    else:
      sense_queryset = remove_all_user_additions(queryset=sense_queryset)

    senses = sense_queryset.order_by('order')
    sense_serializer = SenseSerializer(senses, many = True)
    return sense_serializer.data

class NLPRequestValidator(serializers.Serializer):
  sentence = serializers.CharField(required = True)
  mouse_over = serializers.CharField(required = True)

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
  
class HanjaGameWordSerializer(serializers.Serializer):
  kw_target_code = serializers.IntegerField(source='target_code', default = None)
  kw_word = serializers.CharField(source='word', default = None)
  kw_origin = serializers.CharField(source='origin', default = None)

  class Meta:
    model = KoreanWord
    fields = ['kw_target_code', 'kw_word', 'kw_origin']
    read_only_fields = ['__all__']