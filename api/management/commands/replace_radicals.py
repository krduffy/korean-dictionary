from django.core.management.base import BaseCommand, no_translations
from ...dictionary_models import HanjaCharacter
import django
import json

django.setup()

class Command(BaseCommand):

  def add_arguments(self, parser):
    parser.add_argument('hanzi_fname', type=str, help='Path to the hanzi text file')

  @no_translations
  def handle(self, *args, **kwargs):
    
    #hanzi_fname = "api\\management\\dict_files\\makemeahanzi-data.txt"
    hanzi_fname = kwargs['hanzi_fname']

    updated = 0
    processed = 0

    chars_to_update = []

    with open(hanzi_fname, 'r', encoding='utf-8') as hanzi_file:

      for line in hanzi_file:

        line_as_json = json.loads(line)

        character = line_as_json["character"]
        radical = line_as_json["radical"]

        if HanjaCharacter.objects.filter(pk = character).exists() and radical:
          model_object = HanjaCharacter.objects.get(pk = character)
          model_object.radical = radical + "mmah"
          chars_to_update.append(model_object)
        
        processed += 1

        if processed % 1000 == 0:
          self.stdout.write(f'Processed {processed} characters.')
    
    updated = HanjaCharacter.objects.bulk_update(chars_to_update, ['radical'], batch_size=1000)
      
    self.stdout.write(self.style.SUCCESS(f'Successfully finished executing command; updated {updated} characters'))