from django.core.management.base import BaseCommand, CommandError, CommandParser, no_translations
from ...dictionary_models import KoreanWord, Sense
import os
import django
import json
import re
import html

django.setup()

class Command(BaseCommand):

  @no_translations
  def handle(self, *args, **kwargs):
    dict_dir = "api\\management\\dict_files\\우리말샘"
    json_files = [os.path.join(dict_dir, fileindir) for fileindir in os.listdir(dict_dir)]

    all_known_tcs = list(KoreanWord.objects.filter(known_by__isnull = False).values_list('target_code', flat=True))
    matches = []

    max_words = 250

    found_tcs = []

    for dict_file in json_files:

      with open(dict_file, mode='r', encoding='utf-8') as raw_file:
        dict_json = json.load(raw_file)
        
        for channel_item in dict_json["channel"]["item"]:
          tc = channel_item["group_code"]

          if tc in all_known_tcs:
            
            if len(found_tcs) < max_words and tc not in found_tcs:
              found_tcs.append(tc)

            if tc in found_tcs:
              matches.append(channel_item)

        self.stdout.write('Finished checking senses in file "%s"' % dict_file)
          
      if len(found_tcs) >= max_words:
        self.stdout.write('Hit max words; breaking.')
        break

    new_file = ".\\sample.json"
    with open(new_file, 'w', encoding='utf-8') as sample_json:
      json.dump({ 'channel': { 'total': len(matches), 'item': matches } }, sample_json, ensure_ascii=False, indent=4)

    self.stdout.write(self.style.SUCCESS('Successfully finished executing command'))