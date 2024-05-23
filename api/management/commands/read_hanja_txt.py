from django.core.management.base import BaseCommand, CommandError, CommandParser, no_translations
from ...dictionary_models import HanjaCharacter, KoreanWord
import django
import json
import re

django.setup()

enforced_regex_patterns = {
    "character": r"^[\u4E00-\u9FFF]$",
    "meaning_reading": r"^[가-힣,/ ]+$",
    "radical": r"^([一-龥], \d+획|[一-龥], -\d+획)$",
    "strokes": r"^\d+획$",
    "grade_level": r"^(중학교|고등학교|미배정)(\[\d\])?$",
    "exam_level": r"^(\d급|준\d급|특급|준특급|미배정)(\[\d\])?$",
    "explanation": r".*"
}


def validate_hanja_data(hanja_char_data):
  for field, pattern in enforced_regex_patterns.items():
    value = hanja_char_data.get(field, "")
    if not re.match(pattern, value):
      if not value == "":
        print(f"Manually check for character {hanja_char_data.get("character", "?")}; field {field} violates regex rules.")
        return False
  return True

class Command(BaseCommand):
  
  @no_translations
  def handle(self, *args, **kwargs):
    hanja_fname = "api\\management\\dict_files\\hanja.json"
    hanzi_fname = "api\\management\\dict_files\\makemeahanzi-data.txt"

    written_chars = 0

    with open(hanja_fname, 'r', encoding='utf-8') as main_hanja_file:

      counter = 0

      json_data = json.load(main_hanja_file)

      for hanja_char_data in json_data:

        if hanja_char_data["meaning_reading"] == "":
          counter += 1
        elif validate_hanja_data(hanja_char_data=hanja_char_data):

          character = hanja_char_data["character"]
          meaning_reading = hanja_char_data["meaning_reading"]
          
          # only get first char. dataset contains how many strokes remain after the radical
          # but this can be looked up in the database and is therefore redundant
          radical = hanja_char_data["radical"][0]
          
          # has to be of the form ^\d+획$ so it converts the beginning part (not 획) into an int
          # before saving to the database
          strokes = int(hanja_char_data["strokes"][:-1])
          grade_level = hanja_char_data["grade_level"]
          if '[' in grade_level:
            grade_level = grade_level[:-3]
          exam_level = hanja_char_data["exam_level"]
          if '[' in exam_level:
            exam_level = exam_level[:-3]
          
          explanation = hanja_char_data["explanation"]
          if explanation.endswith("\n"):
            explanation = explanation[:-1]

          new_hanja = HanjaCharacter(character = character, 
                                    meaning_reading = meaning_reading,
                                    radical = radical,
                                    strokes = strokes,
                                    grade_level = grade_level,
                                    exam_level = exam_level,
                                    explanation = explanation)
          new_hanja.save()
          
          counter += 1
          written_chars += 1
        
        if counter % 500 == 0:
          self.stdout.write(f'Finished processing {counter} characters')

    
    self.stdout.write(self.style.SUCCESS(f'Finished reading main hanja file; wrote {written_chars} characters\n'))

    with open(hanzi_fname, 'r', encoding='utf-8') as hanzi_file:

      processed = 0
      written = 0

      for line in hanzi_file:
        line_as_json = json.loads(line)

        character = line_as_json["character"]
        decomposition = line_as_json["decomposition"]

        if HanjaCharacter.objects.filter(pk = character).exists():
          model_object = HanjaCharacter.objects.get(pk = character)
          model_object.decomposition = decomposition

          model_object.save()
          written += 1
        
        processed += 1
        if processed % 1000 == 0:
          self.stdout.write(f'Processed {processed} characters in hanzi file')
      
    self.stdout.write(self.style.SUCCESS(f'Finished reading hanzi file; wrote to {written} characters'))
    self.stdout.write(self.style.SUCCESS(f'Finished executing command'))