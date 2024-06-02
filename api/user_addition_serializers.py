from rest_framework import serializers
from .user_addition_models import UserNote
from .dictionary_models import KoreanWord, Sense
from dictionary_users.models import DictionaryUser
from dictionary_users.serializers import UserSerializer

class KoreanWordField(serializers.PrimaryKeyRelatedField):
    def to_representation(self, value):
        pk = super(KoreanWordField, self).to_representation(value)
        try:
            item = KoreanWord.objects.get(pk=pk)
            return {
               "word": item.word,
               "target_code": pk,
            }
        except KoreanWord.DoesNotExist:
            return None
    
class UserField(serializers.PrimaryKeyRelatedField):
    def to_representation(self, value):
        pk = super(UserField, self).to_representation(value)
        try:
            item = DictionaryUser.objects.get(pk=pk)
            serializer = UserSerializer(item, context=self.context)
            return serializer.data
        except DictionaryUser.DoesNotExist:
            return None

class UserWordSerializer(serializers.Serializer):
  word = serializers.CharField(
        max_length=100, 
        required=True, 
        error_messages={
            'required': '단어는 필수입니다.',
            'blank': '단어는 필수입니다.',
            'max_length': '단어는 최대 100자까지 가능합니다.'
        }
    )
  origin = serializers.CharField(
        max_length=100, 
        required=False, 
        allow_blank=True,
        error_messages={
            'max_length': '출처는 최대 100자까지 가능합니다.'
        }
    )
  word_type = serializers.CharField(
        max_length=3, 
        required=True, 
        error_messages={
            'required': '어류는 필수입니다.',
            'blank': '어류는 필수입니다.',
            'max_length': '어류는 최대 3자까지 가능합니다.'
        }
    )
  creator = UserField(queryset = DictionaryUser.objects.all())

  class Meta:
    model = KoreanWord
    fields = ['word', 'origin', 'word_type', 'creator']

  def to_representation(self, instance):
    representation = super().to_representation(instance)
    # need to return target code for the 바로가기 after a word is created
    representation['target_code'] = instance.target_code
    return representation

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
  # adding word-level (not sense-level) example sentences technically creates a sense
  # with order zero that has definition ""
  definition = serializers.CharField(required=True)
  type = serializers.CharField(required=False)
  order = serializers.IntegerField(required=True)
  category = serializers.CharField(required=False)
  pos = serializers.CharField(required=False)
  additional_info = serializers.JSONField(required=False)
  creator = UserField(queryset = DictionaryUser.objects.all())

  class Meta:
    model = Sense
    fields = ['referent', 'definition', 'type', 'order', 'category', 'pos', 
              'additional_info', 'creator']

  def create(self, validated_data):
    return Sense.objects.create(**validated_data)
  
  def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name in ['type', 'category', 'pos', 'additional_info']:
            self.fields[field_name].required = False

class UserNoteValidator(serializers.ModelSerializer):
  word_ref = KoreanWordField(queryset=KoreanWord.objects.all())
  note_image = serializers.ImageField(required=False)
  order = serializers.IntegerField()
  note_text = serializers.CharField(required=False)
  creator = UserField(queryset = DictionaryUser.objects.all())

  class Meta:
    model = UserNote
    fields = ['word_ref', 'order', 'note_text', 'note_image', 'creator']

  def create(self, validated_data):
    return UserNote.objects.create(**validated_data)
  
  def validate_note_image(self, value):
    valid_image_types = ['image/jpeg', 'image/png', 'image/gif']
    if value and value.content_type not in valid_image_types:
        raise serializers.ValidationError("Please upload a valid image file (JPEG, PNG, GIF).")
    return value
  
class UserNoteSerializer(serializers.ModelSerializer):
   class Meta:
    model = UserNote
    fields = '__all__'
    read_only_fields = ['__all__']