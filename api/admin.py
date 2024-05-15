from django.contrib import admin

from .dictionary_models import KoreanWord, HanjaCharacter, Sense
from .user_addition_models import UserNote

admin.site.register(KoreanWord)
admin.site.register(HanjaCharacter)
admin.site.register(Sense)
admin.site.register(UserNote)