from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from .user_addition_models import UserNote
from .user_addition_serializers import UserNoteSerializer, UserSenseSerializer, UserWordSerializer
from .dictionary_models import KoreanWord, Sense
from .dictionary_serializers import KoreanWordSerializer, SenseSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination

# Page size = 10
class PaginationClass(PageNumberPagination):
  page_size = 10

class CreateNoteView(APIView):
  permission_classes = (IsAuthenticated,)

  def post(self, request):
    serializer = UserNoteSerializer(data = request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateWordView(APIView):

  permission_classes = (IsAuthenticated, )

  def post(self, request):
    serializer = UserWordSerializer(data = request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CreateSenseView(APIView):
  permission_classes = (IsAuthenticated,)

  def post(self, request):
    serializer = UserSenseSerializer(data = request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateWordView(UpdateAPIView):
  permission_classes = (IsAuthenticated,)

  queryset = KoreanWord.objects.all()
  serializer_class = KoreanWordSerializer

class ToggleWordKnownView(APIView):
  permission_classes = (IsAuthenticated,)

  def post(self, request, pk, format=None):
    try:
      korean_word = KoreanWord.objects.get(pk = pk)
      user = request.user

      user.known_words.add(korean_word)
      user.save()

      serializer = KoreanWordSerializer(korean_word, context={'request': request})
      return Response(serializer.data)
    except KoreanWord.DoesNotExist:
      return Response(status=status.HTTP_404_NOT_FOUND)

class UpdateSenseView(UpdateAPIView):
  permission_classes = (IsAuthenticated,)

  queryset = Sense.objects.all()
  serializer_class = SenseSerializer

class UpdateNoteView(UpdateAPIView):
  permission_classes = (IsAuthenticated,)

  queryset = UserNote.objects.all()
  serializer_class = UserNoteSerializer

class UserKnownWords(generics.ListAPIView):
  permission_classes = (IsAuthenticated, )
  serializer_class = KoreanWordSerializer
  pagination_class = PaginationClass

  def get(self, request):
    known_words = self.request.user.known_words.all()
    serializer = KoreanWordSerializer(known_words, many=True, context = {'request': request})
    return Response(serializer.data)