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
        return False
  return True

class Command(BaseCommand):
  
  @no_translations
  def handle(self, *args, **kwargs):

    exclude_file = "api\\management\\dict_files\\redirects.txt"
    exclusions = []
    with open(exclude_file, 'r', encoding='utf-8') as exclude_f:
      for line in exclude_f.readlines():
        exclusions.append(line[0])
    
    print(exclusions)

    hanja_fname = "api\\management\\dict_files\\hanja.json"
    matches = []

    with open(hanja_fname, 'r', encoding='utf-8') as main_hanja_file:

      counter = 0

      json_data = json.load(main_hanja_file)

      for hanja_char_data in json_data:

        if hanja_char_data["meaning_reading"] == "":
          counter += 1
        elif validate_hanja_data(hanja_char_data=hanja_char_data):

          character = hanja_char_data["character"]

          if character in exclusions:
            continue
          
          exam_level = hanja_char_data["exam_level"]

          if '[' in exam_level:
            exam_level = exam_level[:-3]
          
          if exam_level not in ['8급', '준7급', '7급', '준6급', '6급']:
            continue

          word_exists_with_hanja = KoreanWord.objects.filter(origin__contains = character).exists()

          if not word_exists_with_hanja:
            continue

          matches.append(hanja_char_data)

    new_file = ".\\hanja_sample.json"
    with open(new_file, 'w', encoding='utf-8') as sample_json:
      json.dump(matches, sample_json, ensure_ascii=False, indent=4)

    self.stdout.write(self.style.SUCCESS('Successfully finished executing command'))

    