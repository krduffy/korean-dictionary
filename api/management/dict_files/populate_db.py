
from django.core.management.base import BaseCommand
from .. models import KoreanWord, Sense, HanjaCharacter
import os
import hanja
import re

def read_dict_jsons(BaseCommand):
  dict_dir = ".\dictionary"
  json_files = os.listdir(dict_dir)

  for dict_file in json_files:

    with open(dict_file, 'r', encoding='utf-8') as dict_json:
      for sense_structure in dict_json["channel"]["item"]:
        add_sense(sense_structure)
      print(f"Finished adding all of the senses in file: {dict_file}")

# channel_item follows the general structure of ./json_structure.txt
def add_sense(channel_item):

  # make new word if this sense's referent does not yet exist
  word_ref_target_code: int = channel_item["group_code"]
  wordinfo = channel_item["wordinfo"]
  ret: int = add_word(wordinfo, word_ref_target_code)
  if ret == -1:
    return

  sense_target_code: int = channel_item["target_code"]
  sense_referent: KoreanWord = KoreanWord.objects.filter(target_code = word_ref_target_code)

  senseinfo = channel_item["sense_info"]

  sense_def = senseinfo["definition"]
  sense_type = senseinfo["type"]
  sense_order = int(senseinfo["sense_no"])
  sense_category = senseinfo.get("cat_info", "")
  if sense_category:
    sense_category = sense_category[0]["cat"]
    # now string
  sense_pos = senseinfo["pos"]
  
  # Additional information to be stored in the json field.
  additional_info_choices = ["pattern_info", "relation_info", "example_info", "norm_info", 
                             "grammar_info", "history_info", "proverb_info", "region_info"]
  additional_info_or_none = [senseinfo.get(info, None) for info in additional_info_choices]
  sense_additional_info = [info for info in additional_info_or_none if info]

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

  if KoreanWord.objects.get(target_code = word_target_code):
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


def add_all_hanja():
  hanja_fname = "hanjachars.txt"

  with open(hanja_fname, 'r', encoding='utf-8') as hanja_file:
    next(hanja_file)
    next(hanja_file)

    for hanja_line in hanja_file:
      hanja_character: str = hanja_line[0]
      hanja_meaning_reading: str = hanja_line[2:-1]
      new_hanja = HanjaCharacter(character = hanja_character, meaning_reading = hanja_meaning_reading)
      new_hanja.words_that_contain.add(
        korword for korword in KoreanWord.objects.filter(origin__contains = hanja_character))