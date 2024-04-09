from rest_framework import serializers
from .user_models import UserNote
from .dictionary_models import KoreanWord
from .dictionary_serializers import KoreanWordSerializer

class KoreanWordField(serializers.PrimaryKeyRelatedField):
  def to_representation(self, value):
    pk = super(KoreanWordField, self).to_representation(value)
    try:
        item = KoreanWord.objects.get(pk=pk)
        serializer = KoreanWordSerializer(item)
        return serializer.data
    except KoreanWord.DoesNotExist:
        return None
        

class UserNoteSerializer(serializers.Serializer):
  word_ref = KoreanWordField(queryset = KoreanWord.objects.all())
  order = serializers.IntegerField()
  note_text = serializers.CharField(max_length = 1000)
  
  class Meta:
    model = UserNote
    fields = ['word_ref', 'order', 'note_text']

  def create(self, validated_data):
    print(validated_data)
    #validated_data['word_ref'] = KoreanWord.objects.get(pk = validated_data['word_ref'])
    print(validated_data)
    return UserNote.objects.create(**validated_data)