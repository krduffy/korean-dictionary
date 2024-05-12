from django.db import models
from .dictionary_models import KoreanWord
from dictionary_users.models import DictionaryUser

class UserNote(models.Model):
  id = models.BigAutoField(primary_key=True)
  creator = models.ForeignKey(DictionaryUser, on_delete=models.CASCADE, 
                              related_name='created_words', null=False)
  word_ref = models.ForeignKey(KoreanWord, on_delete=models.CASCADE, related_name="user_notes")
  order = models.SmallIntegerField(blank = False)
  note_text = models.CharField(max_length = 1000)