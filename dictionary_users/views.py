from django.shortcuts import render
from rest_framework.generics import CreateAPIView, UpdateAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import DictionaryUser
from .serializers import UserSerializer, CreateUserSerializer, UpdateUserSerializer, LoginSerializer
from knox import views as knox_views
from django.contrib.auth import login

def merge_error_lists(dict_of_lists):
   
   return_list = []
   for k, v in dict_of_lists.items():
      for error in v:
         return_list.append(error)

   return return_list

class CreateUserAPI(CreateAPIView):
    queryset = DictionaryUser.objects.all()
    serializer_class = CreateUserSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
      serializer = self.serializer_class(data=request.data)
      if serializer.is_valid():
        user = serializer.save()
        # cannot just return serializer.data; it needs to be stored inside of a 'user' key
        returned_data = {}
        serialized_user = UserSerializer(instance = user)
        returned_data['user'] = serialized_user.data
        return Response(returned_data, status=status.HTTP_201_CREATED)
      else:
        return Response({ "errors": merge_error_lists(serializer.errors) }, status=status.HTTP_400_BAD_REQUEST)

# never called by end user
class UpdateUserAPI(UpdateAPIView):
    queryset = DictionaryUser.objects.all()
    serializer_class = UpdateUserSerializer

class LoginAPIView(knox_views.LoginView):
    permission_classes = (AllowAny, )
    serializer_class = LoginSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            login(request, user)
            response = super().post(request, format=None)
        else:
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response(response.data, status=status.HTTP_200_OK)
    
class UserInfoView(RetrieveAPIView):
  queryset = DictionaryUser.objects.all()
  serializer_class = UserSerializer