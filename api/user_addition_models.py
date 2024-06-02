from django.db import models
from .dictionary_models import KoreanWord
from dictionary_users.models import DictionaryUser
import uuid
import os

def get_image_path(instance, filename):
  # example path may be MEDIAROOT/userid_1/myimage.png
  _, ext = os.path.splitext(filename)
  new_filename = uuid.uuid4().hex + ext
  return f'user{instance.creator_id}/{new_filename}'

class UserNote(models.Model):
  id = models.BigAutoField(primary_key=True)
  creator = models.ForeignKey(DictionaryUser, on_delete=models.CASCADE, 
                              related_name='created_notes', null=False)
  word_ref = models.ForeignKey(KoreanWord, on_delete=models.CASCADE, 
                               related_name="user_notes", null=False)
  order = models.SmallIntegerField(blank = False)
  note_text = models.CharField(max_length = 1000)
  note_image = models.ImageField(upload_to=get_image_path, null=True, default=None)