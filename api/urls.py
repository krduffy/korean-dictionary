from django.urls import path
from . views import WordList, WordDetail, HanjaList, HanjaDetail

urlpatterns = [
  path('korean_word/', WordList.as_view()),
  path('korean_word/<pk>', WordDetail.as_view()),
  path('hanja_char/', HanjaList.as_view()),
  path('hanja_char/<pk>', HanjaDetail.as_view()),
]