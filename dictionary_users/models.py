from django.db import models
from django.contrib.auth.models import AbstractUser

class DictionaryUser(AbstractUser):

  id = models.BigAutoField(primary_key = True)
  username = models.CharField(unique=True)
  password = models.CharField()

  class Meta:
    db_table = 'auth_user'
