from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from .user_addition_models import UserNote
from .user_addition_serializers import UserNoteSerializer, UserSenseSerializer, UserWordSerializer
from .dictionary_models import KoreanWord, Sense
from .dictionary_serializers import KoreanWordSerializer, SenseSerializer

class CreateNoteView(APIView):
  def post(self, request):
    serializer = UserNoteSerializer(data = request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateWordView(APIView):
  def post(self, request):
    serializer = UserWordSerializer(data = request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CreateSenseView(APIView):
  def post(self, request):
    serializer = UserSenseSerializer(data = request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateWordView(UpdateAPIView):
  queryset = KoreanWord.objects.all()
  serializer_class = KoreanWordSerializer

class ToggleWordKnownView(APIView):
  def put(self, request, pk, format=None):
    try:
      korean_word = KoreanWord.objects.get(pk = pk)
      korean_word.is_known = not korean_word.is_known
      korean_word.save()
      serializer = KoreanWordSerializer(korean_word)
      return Response(serializer.data)
    except KoreanWord.DoesNotExist:
      return Response(status=status.HTTP_404_NOT_FOUND)

class UpdateSenseView(UpdateAPIView):
  queryset = Sense.objects.all()
  serializer_class = SenseSerializer

class UpdateNoteView(UpdateAPIView):
  queryset = UserNote.objects.all()
  serializer_class = UserNoteSerializer