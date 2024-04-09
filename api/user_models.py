from django.db import models
from .dictionary_models import KoreanWord

#class UserWord(models.Model):
#  id = models.BigAutoField(primary_key=True)
#  word = models.CharField(max_length = 100)
#  user_that_created = models.ForeignKey(User, related_name="created_words")

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