from django.db import models
from .dictionary_models import KoreanWord

class UserNote(models.Model):
  id = models.BigAutoField(primary_key=True)
  word_ref = models.ForeignKey(KoreanWord, on_delete=models.CASCADE)
  order = models.SmallIntegerField(blank = False)
  note_text = models.CharField(max_length = 1000)

  #note_image = 

class StudyingWord(models.Model):
  id = models.BigAutoField(primary_key=True)
  word_ref = models.ForeignKey(KoreanWord, on_delete=models.CASCADE)

class KnownWord(models.Model):
  id = models.BigAutoField(primary_key=True)
  word_ref = models.ForeignKey(KoreanWord, on_delete=models.CASCADE)