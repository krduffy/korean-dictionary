from django.core.management.base import BaseCommand, no_translations
from ...dictionary_models import HanjaCharacter
import django
import json

django.setup()

class Command(BaseCommand):

  @no_translations
  def handle(self, *args, **kwargs):
    
    hanzi_fname = "api\\management\\dict_files\\makemeahanzi-data.txt"

    updated = 0
    processed = 0

    with open(hanzi_fname, 'r', encoding='utf-8') as hanzi_file:

      for line in hanzi_file:

        line_as_json = json.loads(line)

        character = line_as_json["character"]
        radical = line_as_json["radical"]

        if HanjaCharacter.objects.filter(pk = character).exists() and radical:
          model_object = HanjaCharacter.objects.get(pk = character)
          model_object.radical = radical + "mmah"
          model_object.save()
          updated += 1
        
        processed += 1

        if processed % 1000 == 0:
          self.stdout.write(f'Processed {processed} characters.')
      
    self.stdout.write(self.style.SUCCESS(f'Successfully finished executing command; updated {updated} characters'))