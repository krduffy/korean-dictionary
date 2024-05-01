from django.db import models
from django.contrib.auth.models import AbstractUser

class DictionaryUser(AbstractUser):
  class Meta:
    db_table = 'auth_user'
