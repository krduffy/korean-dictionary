from django.contrib import admin

# Register your models here.
from . models import KoreanWord, Sense, HanjaCharacter

admin.site.register(KoreanWord)
admin.site.register(Sense)
admin.site.register(HanjaCharacter)