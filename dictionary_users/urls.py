from django.urls import path
from .views import *

urlpatterns = [
  path('create-user/', CreateUserAPI.as_view()),
  path('update-user/<int:pk>/', UpdateUserAPI.as_view()),
  path('login/', LoginAPIView.as_view()),
]

