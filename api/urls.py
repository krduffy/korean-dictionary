from django.urls import path
from .dictionary_views import *
from .user_addition_views import *

urlpatterns = [
  path('search_korean/', KoreanWordList.as_view()),
  path('korean_word/<pk>', KoreanWordDetail.as_view()),
  path('korean_word_lemma/', KoreanWordAnalyze.as_view()),

  # temp
  path('search_sense/', TempSense.as_view()),

  path('search_hanja/', HanjaList.as_view()),
  path('hanja_char/<pk>', HanjaDetail.as_view()),
  path('search_hanja_examples/', HanjaExamples.as_view()),
  path('hanja_popup_view/', HanjaPopup.as_view()),

  path('create_word/', CreateWordView.as_view()),
  path('update_word/<pk>', UpdateWordView.as_view()),
  path('toggle_word_known/<pk>', ToggleWordKnownView.as_view()),
  path('toggle_word_studied/<pk>', ToggleWordStudiedView.as_view()),
  
  path('korean_word_edit_info/<pk>', KoreanWordForEditingView.as_view()),

  path('create_sense/', CreateSenseView.as_view()),
  path('delete_sense/<pk>', DeleteSenseView.as_view()),
  
  path('create_note/', CreateNoteView.as_view()),
  path('delete_note/<pk>', DeleteNoteView.as_view()),
  path('update_note/<pk>', UpdateNoteView.as_view()),

  path('homepage_info/', HomepageInfoView.as_view()),

  path('user_known_words/', UserKnownWords.as_view()),
  path('user_study_words/', UserStudyWords.as_view()),

  path('user_unknown_words/', UnknownWordsView.as_view()),

  path('hanja_game_info/', HanjaGameView.as_view()),
  path('hanja_game_solution_verifier/', HanjaGameSolutionVerifierView.as_view())
]