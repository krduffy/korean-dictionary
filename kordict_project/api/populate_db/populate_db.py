
from django.core.management.base import BaseCommand
from ..models import KoreanWord, Sense, HanjaCharacter
import hanja
import re

# channel_item follows the general structure of ./json_structure.txt
def add_sense(channel_item):

  word_ref_target_code: int = channel_item["group_code"]
  
  if not KoreanWord.objects.filter(target_code = word_ref_target_code):
    # make new word
    wordinfo = channel_item["wordinfo"]
    add_word(wordinfo, word_ref_target_code)
    if not KoreanWord.objects.filter(target_code = word_ref_target_code):
      raise LookupError("could not find a word after it should have been added")

    word_type: str = wordinfo["word_unit"]

  wordinfo = channel_item["wordinfo"]

  

def add_word(wordinfo: dict, target_code: int) -> int:
  word: str = wordinfo["word"]
    
  originlang_info = wordinfo.get("original_language_info", None)
  if originlang_info:
    
    # If word's origin is entirely English, do not add it.
    only_english = True
    for pair in originlang_info.get("word", []):
      if pair["language_type"] != "영어":
        only_english = False
    if only_english:
      return -1
    


  word_type: str = wordinfo["word_unit"]