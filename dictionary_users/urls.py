from django.urls import path
from .views import *
from knox.views import LogoutView

urlpatterns = [
  path('create_user/', CreateUserAPI.as_view()),
  path('update_user/<int:pk>/', UpdateUserAPI.as_view()),
  path('login/', LoginAPIView.as_view()),
  path('logout/', LogoutView.as_view()),

  path('info/<int:pk>/', UserInfoView.as_view()),
]

