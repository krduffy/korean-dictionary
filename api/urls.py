from django.urls import path
from . views import WordList, WordDetail, SenseList, SenseDetail, HanjaList, HanjaDetail

urlpatterns = [
  path('korean_word/', WordList.as_view()),
  path('korean_word/<int:tc>/', WordDetail.as_view()),
  path('sense/', SenseList.as_view()),
  path('sense/<int:tc>', SenseDetail.as_view()),
  path('hanja_char/', HanjaList.as_view()),
  path('hanja_char/<str:hanja>', HanjaDetail.as_view()),
]