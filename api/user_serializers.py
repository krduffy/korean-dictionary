from rest_framework import serializers
from .user_models import UserNote
from .dictionary_models import KoreanWord
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
  target_code = serializers.IntegerField()
  word = serializers.CharField(max_length = 100)
  origin = serializers.CharField(max_length = 100)
  word_type = serializers.CharField(max_length = 3)

  class Meta:
    model = KoreanWord
    fields = ['target_code', 'word', 'origin', 'word_type']

  def create(self, validated_data):
    return KoreanWord.objects.create(**validated_data)

class UserNoteSerializer(serializers.Serializer):
  word_ref = KoreanWordField(queryset = KoreanWord.objects.all())
  order = serializers.IntegerField()
  note_text = serializers.CharField(max_length = 1000)
  
  class Meta:
    model = UserNote
    fields = ['word_ref', 'order', 'note_text']

  def create(self, validated_data):
    return UserNote.objects.create(**validated_data)
  
