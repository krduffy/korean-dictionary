from django.core.management.base import BaseCommand, CommandError, CommandParser, no_translations

from api.user_addition_models import UserNote
from ...dictionary_models import KoreanWord, Sense
import django

django.setup()

class Command(BaseCommand):
  
  @no_translations
  def handle(self, *args, **kwargs):
    user_words = KoreanWord.objects.filter(creator__isnull = False)
    user_words.delete()
    self.stdout.write(self.style.SUCCESS('Successfully deleted user added words'))
    
    user_senses = Sense.objects.filter(creator__isnull = False)
    user_senses.delete()
    self.stdout.write(self.style.SUCCESS('Successfully deleted user added senses'))
    
    #uncomment when user notes are added.
    #UserNote.objects.delete()
    #self.stdout.write(self.style.SUCCESS('Successfully deleted user added notes'))
