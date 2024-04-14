from django.core.management.base import BaseCommand, CommandError, CommandParser, no_translations
from ...dictionary_models import HanjaCharacter, KoreanWord
import django

django.setup()

class Command(BaseCommand):
  
  @no_translations
  def handle(self, *args, **kwargs):
    hanja_fname = "api\\management\\dict_files\\hanjachars.txt"

    with open(hanja_fname, 'r', encoding='utf-8') as hanja_file:
      next(hanja_file)
      next(hanja_file)

      for hanja_line in hanja_file:
        hanja_character: str = hanja_line[0]
        hanja_meaning_reading: str = hanja_line[2:-2]
        new_hanja = HanjaCharacter(character = hanja_character, meaning_reading = hanja_meaning_reading)
        new_hanja.save()
        
    self.stdout.write(self.style.SUCCESS('Successfully finished executing command'))