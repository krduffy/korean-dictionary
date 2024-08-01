from django.core.management.base import BaseCommand, no_translations
from ...dictionary_models import HanjaCharacter
import django
import json

django.setup()

class Command(BaseCommand):
  
  @no_translations
  def handle(self, *args, **kwargs):
    hanzi_fname = "api\\management\\dict_files\\makemeahanzi-data.txt"
    matches = []

    with open(hanzi_fname, 'r', encoding='utf-8') as hanzi_file:

      for line in hanzi_file:

        line_as_json = json.loads(line)

        character = line_as_json["character"]

        if HanjaCharacter.objects.filter(pk = character).exists():
          model_object = HanjaCharacter.objects.get(pk = character)
          if model_object.exam_level in ['8급', '준7급', '7급', '준6급', '6급']:
            matches.append(line)

    new_file = ".\\hanzi_sample.txt"
    with open(new_file, 'w', encoding='utf-8') as sample_txt:
      for line in matches:
        sample_txt.write(line)

    self.stdout.write(self.style.SUCCESS('Successfully finished executing command'))

    