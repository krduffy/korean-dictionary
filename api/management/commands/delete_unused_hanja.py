from django.core.management.base import BaseCommand, no_translations
from ...dictionary_models import HanjaCharacter, KoreanWord
import django

django.setup()

class Command(BaseCommand):

  @no_translations
  def handle(self, *args, **kwargs):

    self.stdout.write(f'Need to process {len(HanjaCharacter.objects.all())} characters.')
    
    deleted = 0
    processed = 0

    for character_object in HanjaCharacter.objects.all():

      word_exists_with_hanja = KoreanWord.objects.filter(origin__contains = character_object.character).exists()

      if not word_exists_with_hanja:
        deleted += 1
        character_object.delete()
      
      processed += 1
      if processed % 500 == 0:
        self.stdout.write(f'Processed {processed} characters')

    self.stdout.write(self.style.SUCCESS(f'Successfully finished executing command; deleted {deleted} characters'))