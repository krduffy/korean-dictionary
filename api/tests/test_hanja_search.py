from django.test import TestCase
from rest_framework.test import APIClient
from typing import List, Dict

from api.dictionary_models import HanjaCharacter

API_ENDPOINT = '/api/search_hanja/'

def isExactHanjaOrder(results: List[Dict[str, any]], hanja_list: List[int]) -> bool:
  """
    A function that returns whether a list of results follows an exact order (by their target codes).

    Parameters:
      - `results`: The list of result json dictionaries.
      - `hanja_list`: The list of hanja characters, ordered by how they should appear in `results`.
  """
  if len(results) != len(hanja_list):
    return False

  for i in range (len(results)):
    if results[i]['character'] != hanja_list[i]:
      return False
  
  return True

def characterInResults(results: List[Dict[str, any]], character: str) -> bool:
  """
    A function that returns whether a list of results has a given hanja character.

    Parameters:
      - `results`: The list of result json dictionaries.
      - `character`: The character to find in `results`.
  """
  characters = [result['character'] for result in results]
  return character in characters

class TestHanjaSearch(TestCase):
  @classmethod
  def setUpTestData(cls):  
    # stroke counts are intentionally incorrect for first 7
    cls.char1 = HanjaCharacter.objects.create(character='月', meaning_reading='달 월', result_ranking=16, strokes=1)
    cls.char2 = HanjaCharacter.objects.create(character='火', meaning_reading='불 화', result_ranking=16, strokes=1)
    cls.char3 = HanjaCharacter.objects.create(character='花', meaning_reading='꽃 화', result_ranking=14, strokes=1)
    cls.char4 = HanjaCharacter.objects.create(character='不', meaning_reading='아닐 불, 아닌가 부', result_ranking=15, strokes=1)
    cls.char5 = HanjaCharacter.objects.create(character='話', meaning_reading='말씀 화', result_ranking=13, strokes=1)
    cls.char6 = HanjaCharacter.objects.create(character='末', meaning_reading='끝 말', result_ranking=10, strokes=1)
    cls.char7 = HanjaCharacter.objects.create(character='父', meaning_reading='아비 부', result_ranking=16, strokes=1)
    cls.char8 = HanjaCharacter.objects.create(character='地', meaning_reading='땅 지', result_ranking=14, strokes=6)
    cls.char9 = HanjaCharacter.objects.create(character='紙', meaning_reading='종이 지', result_ranking=14, strokes=10)

  def setUp(self):
    self.client = APIClient()

  def test_meaning_reading_before(self):
    """
      Tests that a character whose meaning_reading contains the search term is placed before one 
      that does not in search results.
    """

    search_term = '말'
    response = self.client.get(API_ENDPOINT, {'search_term': search_term})

    data = response.json()
    # results should be 끝 말 and 말씀 화
    self.assertEqual(len(data['results']), 2)
    self.assertTrue(isExactHanjaOrder(data['results'], ['末', '話']))

  def test_ordered_by_result_ranking(self):
    """Tests that characters are ordered by their result_ranking in descending order."""

    search_term = '화'
    response = self.client.get(API_ENDPOINT, {'search_term': search_term})

    data = response.json()
    # results should be 불 화, 꽃 화, and 말씀 화
    self.assertEqual(len(data['results']), 3)
    self.assertTrue(isExactHanjaOrder(data['results'], ['火', '花', '話']))
    
  def test_lower_strokes_before(self):
    """
      Tests that a character whose stroke count is lower will appear before another character
      with all other factors (whether the search term is in the meaning or the reading, its result_ranking)
      the same.
    """

    search_term = '지'
    response = self.client.get(API_ENDPOINT, {'search_term': search_term})

    data = response.json()
    # results should be 땅 지 (6 strokes) and 종이 지 (10 strokes)
    self.assertEqual(len(data['results']), 2)
    self.assertTrue(isExactHanjaOrder(data['results'], ['地', '紙']))