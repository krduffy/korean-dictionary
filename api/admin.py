from django.contrib import admin
from .dictionary_models import KoreanWord, HanjaCharacter, Sense
from .user_addition_models import UserNote

@admin.register(KoreanWord)
class KoreanWordAdmin(admin.ModelAdmin):
    search_fields = ('target_code', 'word')

@admin.register(HanjaCharacter)
class HanjaCharacterAdmin(admin.ModelAdmin):
    search_fields = ('character',)

@admin.register(Sense)
class SenseAdmin(admin.ModelAdmin):
    search_fields = ('target_code',)

@admin.register(UserNote)
class UserNoteAdmin(admin.ModelAdmin):
    search_fields = ('id',)