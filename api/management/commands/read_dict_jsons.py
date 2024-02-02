from django.core.management.base import BaseCommand, CommandError, CommandParser, no_translations
from ...models import KoreanWord, Sense
import os
import django
import json

django.setup()

class Command(BaseCommand):

  def add_arguments(self, parser: CommandParser) -> None:
    parser.add_argument('fname', type=str, help='Indicate which file should be added (\'all\') for all files.)')
  
  @no_translations
  def handle(self, *args, **kwargs):
    dict_dir = "api\\management\\dict_files\\우리말샘"
    json_files: [str] = []

    file = kwargs['fname']
    if not file:
      raise CommandError('You must supply kwargs')
    if file == 'all':
      json_files = [os.path.join(dict_dir, fileindir) for fileindir in os.listdir(dict_dir)]
      self.stdout.write(f"it is {json_files}")
      self.stdout.write(f"type is {type(json_files[0])}")
    else:
      json_files.append(os.path.join(dict_dir, file))

    for dict_file in json_files:

      with open(dict_file, mode='r', encoding='utf-8') as raw_file:
        dict_json = json.load(raw_file)
        for sense_structure in dict_json["channel"]["item"]:
          add_sense(sense_structure)
        self.stdout.write('Finished adding all senses in file "%s"' % dict_file)
    
    self.stdout.write(self.style.SUCCESS('Successfully finished executing command'))

# channel_item follows the general structure of ./json_structure.txt
def add_sense(channel_item):

  # make new word if this sense's referent does not yet exist
  word_ref_target_code: int = channel_item["group_code"]
  wordinfo = channel_item["wordinfo"]
  ret: int = add_word(wordinfo, word_ref_target_code)
  if ret == -1:
    return

  sense_target_code: int = channel_item["target_code"]
  sense_referent: KoreanWord = KoreanWord.objects.get(target_code = word_ref_target_code)

  senseinfo = channel_item["senseinfo"]

  sense_def = senseinfo["definition"]
  sense_type = senseinfo["type"]
  sense_order = channel_item["group_order"]
  sense_category = senseinfo.get("cat_info", "")
  if sense_category:
    sense_category = sense_category[0]["cat"]
    # now string
  sense_pos = senseinfo.get("pos", "")
  
  # Additional information to be stored in the json field.
  additional_info_choices = ["pattern_info", "relation_info", "example_info", "norm_info", 
                             "grammar_info", "history_info", "proverb_info", "region_info"]
  additional_info_or_none = {info: senseinfo.get(info, None) for info in additional_info_choices}
  sense_additional_info = {info_key: info_value for 
                           info_key, info_value in additional_info_or_none.items() 
                           if info_value is not None}

  new_sense = Sense(target_code = sense_target_code, 
                    referent = sense_referent, 
                    definition = sense_def, 
                    type = sense_type, 
                    order = sense_order, 
                    category = sense_category, 
                    pos = sense_pos, 
                    additional_info = sense_additional_info)
  new_sense.save()
  
# Returns 0 if word was added successfully.
# Returns 1 if word is already in the database.
# Returns -1 if word originated entirely from English and was therefore not added.
def add_word(wordinfo: dict, word_target_code: int) -> int:

  if KoreanWord.objects.filter(target_code = word_target_code):
    return 1

  originlang_info = wordinfo.get("original_language_info", None)
  if originlang_info:
    # If word's origin is entirely English, do not add it.
    only_english = True
    for pair in originlang_info:
      if pair["language_type"] != "영어":
        only_english = False
    if only_english:
      return -1
    
  # If here, word needs to be added and return 0
  word: str = wordinfo["word"]
  word_type: str = wordinfo["word_unit"]
  origin: str = ""
  if originlang_info:
    for pair in originlang_info:
      origin += pair["original_language"]

  new_word = KoreanWord(target_code = word_target_code, 
                        word = word, 
                        origin = origin, 
                        word_type = word_type)
  new_word.save()
  return 0