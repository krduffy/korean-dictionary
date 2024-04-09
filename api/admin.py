from django.contrib import admin

from .dictionary_models import KoreanWord, HanjaCharacter

admin.site.register(KoreanWord)
admin.site.register(HanjaCharacter)