from django.db import models

class Setting(models.Model):
  key = models.CharField(max_length=50, unique=True)
  value = models.CharField(max_length=255)

  @classmethod
  def get_setting(cls, key, default=None):
    try:
      return cls.objects.get(key=key).value
    except cls.DoesNotExist:
      return default

  @classmethod
  def set_setting(cls, key, value):
    cls.objects.update_or_create(key=key, defaults={'value': value})