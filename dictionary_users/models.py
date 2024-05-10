from django.db import models
from django.contrib.auth.models import AbstractUser

class DictionaryUser(AbstractUser):

  id = models.BigAutoField(primary_key = True)
  username = models.CharField(unique=True)
  password = models.CharField()

  # Implicit keys
    # created_words
    # created_senses
  known_words = models.ManyToManyField('api.KoreanWord', related_name='known_by')
  study_words = models.ManyToManyField('api.KoreanWord', related_name='studied_by')

  class Meta:
    db_table = 'auth_user'
