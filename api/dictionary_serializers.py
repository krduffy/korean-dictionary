from rest_framework import serializers

from api.util import remove_all_user_additions, remove_non_user_additions
from .dictionary_models import KoreanWord, Sense, HanjaCharacter
from .user_addition_serializers import UserNoteSerializer

class KoreanWordSerializer(serializers.ModelSerializer):
  target_code = serializers.IntegerField()
  word = serializers.CharField()
  origin = serializers.CharField()
  word_type = serializers.CharField()
  senses = serializers.SerializerMethodField()
  user_data = serializers.SerializerMethodField()

  class Meta:
    model = KoreanWord
    fields = ['target_code', 'word', 'origin', 'word_type', 
              'senses', 'user_data']
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
  notes = serializers.SerializerMethodField()

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
  
  def get_notes(self, obj):
    
    if self.context['request'].user.is_authenticated:
      note_queryset = obj.user_notes.all()
      notes = remove_non_user_additions(queryset = note_queryset, allowed_user=self.context['request'].user.pk)
      note_serializer = UserNoteSerializer(notes, many = True)
      return note_serializer.data
    else:
      return []

class NLPRequestValidator(serializers.Serializer):
  sentence = serializers.CharField(required = True)
  mouse_over = serializers.CharField(required = True)

class SimplifiedSenseSerializer(serializers.ModelSerializer):

  target_code = serializers.IntegerField()
  definition = serializers.CharField()
  type = serializers.CharField()
  order = serializers.IntegerField()
  category = serializers.CharField()
  pos = serializers.CharField()

  class Meta:
    model = Sense
    fields = ['target_code', 'definition', 'type', 'order', 
              'category', 'pos']
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
  target_code = serializers.IntegerField()
  word = serializers.CharField()
  origin = serializers.CharField()
  first_definition = serializers.SerializerMethodField()

  class Meta:
    model = KoreanWord
    fields = ['target_code', 'word', 'origin', 'first_definition']
    read_only_fields = ['__all__']

  def get_first_definition(self, obj):
    sense_queryset = obj.senses.all()
    if self.context['request'].user.is_authenticated:
      sense_queryset = remove_non_user_additions(queryset=sense_queryset, allowed_user=self.context['request'].user.pk)
    else:
      sense_queryset = remove_all_user_additions(queryset=sense_queryset)

    first = sense_queryset.filter(order__gt = 0).order_by('order')[0]

    return first.definition if first is not None else "정의는 아직 추가하지 않으셨습니다."
  
class HanjaGameWordSerializer(serializers.Serializer):
  target_code = serializers.IntegerField()
  word = serializers.CharField()
  origin = serializers.CharField()

  class Meta:
    model = KoreanWord
    fields = ['target_code', 'word', 'origin']
    read_only_fields = ['__all__']