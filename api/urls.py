from django.urls import path
from .dictionary_views import *
from .user_addition_views import *

urlpatterns = [
  path('korean_word/', KoreanWordList.as_view()),
  path('korean_word/<pk>', KoreanWordDetail.as_view()),
  path('hanja_char/', HanjaList.as_view()),
  path('hanja_char/<pk>', HanjaDetail.as_view()),
  path('hanja_examples/', HanjaExamples.as_view()),
  path('hanja_popup_view/', HanjaPopup.as_view()),

  path('create_word/', CreateWordView.as_view()),
  path('update_word/<pk>', UpdateWordView.as_view()),
  path('toggle_word_known/<pk>', ToggleWordKnownView.as_view()),
  path('create_sense/', CreateSenseView.as_view()),
  path('update_sense/<pk>', UpdateSenseView.as_view()),
  path('create_note/', CreateNoteView.as_view()),
  path('update_note/<pk>', UpdateNoteView.as_view()),
]