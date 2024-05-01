from django.urls import path
from .dictionary_views import *

urlpatterns = [
  path('korean_word/', KoreanWordList.as_view()),
  path('korean_word/<pk>', KoreanWordDetail.as_view()),
  path('hanja_char/', HanjaList.as_view()),
  path('hanja_char/<pk>', HanjaDetail.as_view()),
  path('hanja_examples/', HanjaExamples.as_view()),
  path('hanja_popup_view/', HanjaPopup.as_view()),
]