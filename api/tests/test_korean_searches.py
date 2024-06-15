from django.test import TestCase
from rest_framework.test import APIClient
from knox.models import AuthToken
from typing import List, Dict

from dictionary_users.models import DictionaryUser
from api.dictionary_models import KoreanWord

def isExactKoreanWordOrder(results: List[Dict[str, any]], target_code_list: List[int]) -> bool:
  """
    A function that returns whether a list of results follows an exact order (by their target codes).

    Parameters:
      - `results`: The list of result json dictionaries.
      - `target_code_list`: The list of target codes, ordered by how they should appear in `results`.
  """
  if len(results) != len(target_code_list):
    return False

  for i in range (len(results)):
    if results[i]['kw_target_code'] != target_code_list[i]:
      return False
  
  return True

def targetCodeInResults(results: List[Dict[str, any]], target_code: int) -> bool:
  """
    A function that returns whether a list of results has a word with a given target code.

    Parameters:
      - `results`: The list of result json dictionaries.
      - `target_code`: The target code to find in `results`.
  """
  target_codes = [word['kw_target_code'] for word in results]
  return target_code in target_codes

class TestLoggedOutKoreanWordSearch(TestCase):

  @classmethod
  def setUpTestData(cls):  
    cls.word1 = KoreanWord.objects.create(target_code=1, word='단어')
  
  def setUp(self):
    self.client = APIClient()

  def test_does_not_contain_user_data(self):
    """Tests that when there is no logged in user, the kw_user_data key in a result has a value of None."""
    search_term = '단어'
    response = self.client.get('/api/korean_word/', {'search_term': search_term})

    data = response.json()
    self.assertEqual(len(data['results']), 1)
    self.assertIsNone(data['results'][0]['kw_user_data'])

class TestLoggedInKoreanWordSearch(TestCase):

  @classmethod
  def setUpTestData(cls):

    cls.word1 = KoreanWord.objects.create(target_code=1, word='지열')
    cls.word2 = KoreanWord.objects.create(target_code=2, word='지대')
    cls.word3 = KoreanWord.objects.create(target_code=3, word='기지')
    cls.word4 = KoreanWord.objects.create(target_code=4, word='기기')
    cls.word5 = KoreanWord.objects.create(target_code=5, word='지지율')
    cls.word6 = KoreanWord.objects.create(target_code=6, word='지탱하다')
    cls.word7 = KoreanWord.objects.create(target_code=7, word='기지')

    cls.user = DictionaryUser.objects.create_user(username="test_user", password="test_user")

  def setUp(self):
    self.client = APIClient()
    self.user = TestLoggedInKoreanWordSearch.user
    self.token = AuthToken.objects.create(user=self.user)[1]
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
  
  def test_contains_user_data(self):
    """Tests that when there is a logged in user, the kw_user_data key in a result does not have a value of None."""
    search_term = '지열'
    response = self.client.get('/api/korean_word/', {'search_term': search_term})

    data = response.json()
    self.assertEqual(len(data['results']), 1)
    self.assertIsNotNone(data['results'][0]['kw_user_data'])
  
  def test_ordered_by_target_code(self):
    """Tests that when there is more than one result, they are ordered by target code."""
    search_term = '기지'
    response = self.client.get('/api/korean_word/', {'search_term': search_term})

    data = response.json()
    self.assertEqual(len(data['results']), 2)
    self.assertTrue(isExactKoreanWordOrder(data['results'], [3, 7]))
  
  def test_known_to_top(self):
    """Tests that a user's known words are moved to the top of the results list."""
    # Set the 기지 with target_code 7 to known
    TestLoggedInKoreanWordSearch.user.known_words.set([TestLoggedInKoreanWordSearch.word7])

    search_term = '기지'
    response = self.client.get('/api/korean_word/', {'search_term': search_term})

    data = response.json()
    self.assertEqual(len(data['results']), 2)
    self.assertTrue(isExactKoreanWordOrder(data['results'], [7, 3]))

    # Reset known_words
    TestLoggedInKoreanWordSearch.user.known_words.set([])
  
  def test_studied_to_top(self):
    """Tests that a user's studied words are moved to the top of the results list."""
    # Set the 기지 with target_code 7 to studied
    TestLoggedInKoreanWordSearch.user.study_words.set([TestLoggedInKoreanWordSearch.word7])

    search_term = '기지'
    response = self.client.get('/api/korean_word/', {'search_term': search_term})

    data = response.json()
    self.assertEqual(len(data['results']), 2)
    self.assertTrue(isExactKoreanWordOrder(data['results'], [7, 3]))

    # Reset study_words
    TestLoggedInKoreanWordSearch.user.study_words.set([])
  
  def test_star(self):
    """Tests that a * in search_term correctly translates to .* in the search regex."""
    search_term = '*지*'
    response = self.client.get('/api/korean_word/', {'search_term': search_term})

    data = response.json()
    # Every word except 기기 (tc 4) should match
    self.assertEqual(len(data['results']), 6)
    self.assertFalse(targetCodeInResults(data['results'], 4))
  
  def test_wildcard(self):
    """Tests that a . in search_term is correctly parsed in the search regex."""
    search_term = '_지_'
    response = self.client.get('/api/korean_word/', {'search_term': search_term})

    data = response.json()
    # Only 지지율 (tc 5) should match
    self.assertEqual(len(data['results']), 1)
    self.assertTrue(targetCodeInResults(data['results'], 5))