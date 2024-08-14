

from django.core.management.base import BaseCommand, no_translations
from ...dictionary_models import HanjaCharacter
import django

django.setup()

class Command(BaseCommand):

  @no_translations
  def handle(self, *args, **kwargs):
    
    simplified_fname = "api\\management\\dict_files\\redirects.txt"

    with open(simplified_fname, 'r', encoding='utf-8') as simplified_fname:

      for line in simplified_fname:

        character = line[0]
        
        if HanjaCharacter.objects.filter(character = character).exists():
          HanjaCharacter.objects.filter(character=character).delete()
      
    self.stdout.write(self.style.SUCCESS(f'Successfully finished executing command'))