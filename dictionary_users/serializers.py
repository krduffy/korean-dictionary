from rest_framework import serializers
from .models import DictionaryUser
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = DictionaryUser
    fields = ('id', 'username', 'password')

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DictionaryUser
        fields = ('username', 'password')
        extra_kwargs = {
            'password': {'required': True}
        }

    def validate(self, attrs):
        username = attrs.get('username', '')
        if DictionaryUser.objects.filter(username=username).exists():
            raise serializers.ValidationError('Username is taken.')
        return attrs

    def create(self, validated_data):
        user = DictionaryUser.objects.create_user(**validated_data)
        return user


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DictionaryUser
        fields = ('username', 'password')

    def update(self, instance, validated_data):
        password = validated_data.pop('password')
        if password:
            instance.set_password(password)
        instance = super().update(instance, validated_data)
        return instance


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    password = serializers.CharField(required=False, style={'input_type': 'password'}, trim_whitespace=False)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if not username:
            raise serializers.ValidationError('아이디는 필수입니다.')
        elif not password:
            raise serializers.ValidationError('비밀번호는 필수입니다.')

        user = authenticate(request=self.context.get('request'), username=username,
                            password=password)
        if not DictionaryUser.objects.filter(username=username).exists() or not user:
            raise serializers.ValidationError('아이디나 비밀번호가 올바르지 않습니다.')

        attrs['user'] = user
        return attrs