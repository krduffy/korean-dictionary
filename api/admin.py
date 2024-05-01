from django.contrib import admin

from .dictionary_models import KoreanWord, HanjaCharacter, Sense

admin.site.register(KoreanWord)
admin.site.register(HanjaCharacter)
admin.site.register(Sense)