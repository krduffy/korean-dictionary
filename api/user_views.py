from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .user_models import UserNote
from .user_serializers import UserNoteSerializer

class CreateNoteView(APIView):
  def post(self, request):
    serializer = UserNoteSerializer(data = request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)