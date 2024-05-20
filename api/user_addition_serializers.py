from rest_framework import serializers
from .user_addition_models import UserNote
from .dictionary_models import KoreanWord, Sense
from .dictionary_serializers import KoreanWordDetailedSerializer

class KoreanWordField(serializers.PrimaryKeyRelatedField):
  def to_representation(self, value):
    pk = super(KoreanWordField, self).to_representation(value)
    try:
        item = KoreanWord.objects.get(pk=pk)
        serializer = KoreanWordDetailedSerializer(item)
        return serializer.data
    except KoreanWord.DoesNotExist:
        return None

class UserWordSerializer(serializers.Serializer):
  word = serializers.CharField(max_length = 100)
  origin = serializers.CharField(max_length = 100)
  word_type = serializers.CharField(max_length = 3)

  class Meta:
    model = KoreanWord
    fields = ['word', 'origin', 'word_type']

  def create(self, validated_data):
    return KoreanWord.objects.create(**validated_data)
  
  def update(self, instance, validated_data):
    instance.word = validated_data.get('word', instance.word)
    instance.origin = validated_data.get('origin', instance.origin)
    instance.word_type = validated_data.get('word_type', instance.word_type)
    instance.save()
    return instance

class UserSenseSerializer(serializers.Serializer):
  referent = KoreanWordField(queryset = KoreanWord.objects.all())
  definition = serializers.CharField()
  type = serializers.CharField()
  order = serializers.IntegerField()
  category = serializers.CharField()
  pos = serializers.CharField()
  additional_info = serializers.JSONField()

  class Meta:
    model = Sense
    fields = ['referent', 'definition', 'type', 'order', 'category', 'pos', 'additional_info']

  def create(self, validated_data):
    return Sense.objects.create(**validated_data)
  
  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)
    for field_name in ['type', 'category', 'pos', 'additional_info']:
      self.fields[field_name].required = False


class UserNoteSerializer(serializers.Serializer):
  word_ref = KoreanWordField(queryset = KoreanWord.objects.all())
  order = serializers.IntegerField()
  note_text = serializers.CharField(max_length = 1000)
  
  class Meta:
    model = UserNote
    fields = ['word_ref', 'order', 'note_text']

  def create(self, validated_data):
    return UserNote.objects.create(**validated_data)