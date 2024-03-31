from django.urls import path
from . views import WordList, WordDetail, HanjaList, HanjaDetail, HanjaExamples, HanjaPopup

urlpatterns = [
  path('korean_word/', WordList.as_view()),
  path('korean_word/<pk>', WordDetail.as_view()),
  path('hanja_char/', HanjaList.as_view()),
  path('hanja_char/<pk>', HanjaDetail.as_view()),
  path('hanja_examples/', HanjaExamples.as_view()),
  path('hanja_popup_view/', HanjaPopup.as_view()),
]