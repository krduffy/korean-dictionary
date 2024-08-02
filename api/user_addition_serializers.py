from rest_framework import serializers

from api.util import get_only_user_additions
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


class KoreanWordForEditingSerializer(serializers.ModelSerializer):
  target_code = serializers.IntegerField()
  word = serializers.CharField()
  # because all examples are held under a single sense, the sense that contains them
  # has its target code returned.
  example_info = serializers.SerializerMethodField()
  notes = serializers.SerializerMethodField()

  class Meta:
    model = KoreanWord
    fields = ['target_code', 'word', 'example_info', 'notes']
    read_only_fields = ['__all__']

  def get_example_info(self, obj):
    only_user_senses = get_only_user_additions(Sense.objects.all(), self.context['request'].user.pk)
    sense = only_user_senses.filter(referent = obj.pk)

    if sense.exists():
       sense = sense.first()
       return {'target_code': sense.pk, 'examples': sense.additional_info['example_info']}
    else:
       return {'target_code': 0, 'examples': []}
    
  def get_notes(self, obj):
     notes = get_only_user_additions(obj.user_notes, self.context['request'].user.pk)

     return UserNoteSerializer(notes, many=True).data


class UserField(serializers.PrimaryKeyRelatedField):
    def to_representation(self, value):
        pk = super(UserField, self).to_representation(value)
        try:
            item = DictionaryUser.objects.get(pk=pk)
            serializer = UserSerializer(item, context=self.context)
            return serializer.data
        except DictionaryUser.DoesNotExist:
            return None

# user word serializer currently not in use due to words not being able to be added
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

class UserExamplesSenseSerializer(serializers.Serializer):
  referent = KoreanWordField(queryset = KoreanWord.objects.all())
  # adding word-level (not sense-level) example sentences technically creates a sense
  # with order zero that has definition ""
  definition = serializers.CharField(required=True)
  type = serializers.CharField(required=False)
  order = serializers.IntegerField(required=True)
  category = serializers.CharField(required=False)
  pos = serializers.CharField(required=False)
  additional_info = serializers.JSONField(
     required=True)
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
  
  def validate_additional_info(self, value):
    if not isinstance(value, dict):
      raise serializers.ValidationError("예문들은 포맷이 틀립니다.")

    for key, item in value.items():
      
      if key == 'example_info':      

        if not isinstance(item, list):
          raise serializers.ValidationError(f"{item}는 리스트 형태여야 됩니다.")

        if len(item) == 0:
          raise serializers.ValidationError("저장할 예문이 없습니다.")

        for item_dict in item:
          if not isinstance(item_dict, dict):
            raise serializers.ValidationError(f"{item_dict}는 딕셔내리 형태여야 됩니다.")

          if 'example' not in item_dict.keys() or not item_dict['example']:
            raise serializers.ValidationError("모든 예문은 문장 부분이 필수입니다.")
              
    return value

class UserNoteValidator(serializers.ModelSerializer):
  word_ref = KoreanWordField(queryset=KoreanWord.objects.all())
  note_image = serializers.ImageField(
     required=True,
     error_messages = {
        'required': '이미지는 필수입니다.',
        'blank': '이미지는 필수입니다.' 
     })
  # order not really used; may eventually allow explicit control over order in which notes appear
  order = serializers.IntegerField()
  note_text = serializers.CharField(required=False, allow_blank=True)
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