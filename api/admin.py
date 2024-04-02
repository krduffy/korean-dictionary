from django.contrib import admin

from .dictionary_models import KoreanWord, HanjaCharacter
from .user_models import User

admin.site.register(KoreanWord)
admin.site.register(HanjaCharacter)
admin.site.register(User)