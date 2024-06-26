from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from knox.models import AuthToken

from dictionary_users.models import DictionaryUser
from api.dictionary_models import KoreanWord, HanjaCharacter

API_ENDPOINT = '/api/hanja_game_info/'

def forms_path(origins):

  for i in range(len(origins) - 1):
    found_same = False

    for char in origins[i]:
      if char in origins[i + 1]:
        found_same = True

    if not found_same:
      return False
    
  return True

class TestHanjaGameSimpleTripleView(TestCase):

  @classmethod
  def setUpTestData(cls):
    
    # with three words 인심, 미인, 미녀, it will have to backtrack if 미인 is the first
    # selected word in the path
    cls.word1 = KoreanWord.objects.create(target_code=1, word="인심", origin="人心")
    cls.word2 = KoreanWord.objects.create(target_code=2, word="미인", origin="美人")
    cls.word3 = KoreanWord.objects.create(target_code=3, word="미녀", origin="美女")
    # purpose of word 4 is to make sure there are at least 16 characters for the view to return
    cls.word4 = KoreanWord.objects.create(target_code=4, word="뭐뭐뭐", origin="零一二三四五六七八九十百千月火水木金土日")

    cls.character1 = HanjaCharacter.objects.create(pk="心", meaning_reading="마음 심", strokes=1)
    cls.character2 = HanjaCharacter.objects.create(pk="人", meaning_reading="사람 인", strokes=1)
    cls.character3 = HanjaCharacter.objects.create(pk="美", meaning_reading="아름다울 미", strokes=1)
    cls.character4 = HanjaCharacter.objects.create(pk="女", meaning_reading="계집 녀", strokes=1)
      
    cls.user = DictionaryUser.objects.create_user(username="test_user", password="test_user")
    cls.user.known_words.set([cls.word1, cls.word2, cls.word3, cls.word4])

  def setUp(self):
    self.client = APIClient()
    self.user = TestHanjaGameSimpleTripleView.user
    self.token = AuthToken.objects.create(user=self.user)[1]
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)

  def test_triple(self):
    length = 3

    for seed in range (0, 3):
      with self.subTest(seed=seed):
        
        response = self.client.get(API_ENDPOINT, {'length': length, 'seed': seed})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        # Ensure the path length is as expected
        self.assertEqual(len(data['hanja_path']), length)
        
        # Ensure there are no duplicate characters in the path
        path_characters = [step['step_character']['character'] for step in data['hanja_path']]
        self.assertEqual(len(path_characters), len(set(path_characters)))

        word_origins = [step['example_word']['origin'] for step in data['hanja_path']]
        self.assertEqual(forms_path(word_origins), True)

class TestHanjaGameBacktrackSameCharacterView(TestCase):

  @classmethod
  def setUpTestData(cls):
    
    # with three words 인심, 미인, 일인, , it will have to backtrack if it picks 인심 and then 미인
    # but still end up using 인 to continue the path (with 범인)
    cls.word1 = KoreanWord.objects.create(target_code=1, word="인심", origin="人心")
    cls.word2 = KoreanWord.objects.create(target_code=2, word="미인", origin="美人")
    cls.word3 = KoreanWord.objects.create(target_code=3, word="범인", origin="犯人")
    cls.word4 = KoreanWord.objects.create(target_code=4, word="침범", origin="侵犯")
    # purpose of word 4 is to make sure there are at least 16 characters for the view to return
    cls.word5 = KoreanWord.objects.create(target_code=5, word="뭐뭐뭐", origin="零一二三四五六七八九十百千月火水木金土日")

    cls.character1 = HanjaCharacter.objects.create(pk="心", meaning_reading="마음 심", strokes=1)
    cls.character2 = HanjaCharacter.objects.create(pk="人", meaning_reading="사람 인", strokes=1)
    cls.character3 = HanjaCharacter.objects.create(pk="美", meaning_reading="아름다울 미", strokes=1)
    cls.character4 = HanjaCharacter.objects.create(pk="犯", meaning_reading="범할 범", strokes=1)
    cls.character5 = HanjaCharacter.objects.create(pk="侵", meaning_reading="침노할 침", strokes=1)
      
    cls.user = DictionaryUser.objects.create_user(username="test_user", password="test_user")
    cls.user.known_words.set([cls.word1, cls.word2, cls.word3, cls.word4, cls.word5])

  def setUp(self):
    self.client = APIClient()
    self.user = TestHanjaGameBacktrackSameCharacterView.user
    self.token = AuthToken.objects.create(user=self.user)[1]
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)

  def test_backtrack_with_same_character(self):
    length = 3

    for seed in range (0, 5):

      with self.subTest(seed=seed):
        
        response = self.client.get(API_ENDPOINT, {'length': length, 'seed': seed})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        # Ensure the path length is as expected
        self.assertEqual(len(data['hanja_path']), length)
        
        # Ensure there are no duplicate characters in the path
        path_characters = [step['step_character']['character'] for step in data['hanja_path']]
        self.assertEqual(len(path_characters), len(set(path_characters)))

        word_origins = [step['example_word']['origin'] for step in data['hanja_path']]
        self.assertEqual(forms_path(word_origins), True)
  
class TestHanjaGameNoKnownWords(TestCase):

  @classmethod
  def setUpTestData(cls):
    
    # with three words 인심, 미인, 일인, , it will have to backtrack if it picks 인심 and then 미인
    # but still end up using 인 to continue the path (with 범인)
    cls.word1 = KoreanWord.objects.create(target_code=1, word="인심", origin="人心")
    cls.word2 = KoreanWord.objects.create(target_code=2, word="미인", origin="美人")
    cls.word3 = KoreanWord.objects.create(target_code=3, word="범인", origin="犯人")
    cls.word4 = KoreanWord.objects.create(target_code=4, word="침범", origin="侵犯")
    # purpose of word 4 is to make sure there are at least 16 characters for the view to return
    cls.word5 = KoreanWord.objects.create(target_code=5, word="뭐뭐뭐", origin="零一二三四五六七八九十百千月火水木金土日")

    cls.character1 = HanjaCharacter.objects.create(pk="心", meaning_reading="마음 심", strokes=1)
    cls.character2 = HanjaCharacter.objects.create(pk="人", meaning_reading="사람 인", strokes=1)
    cls.character3 = HanjaCharacter.objects.create(pk="美", meaning_reading="아름다울 미", strokes=1)
    cls.character4 = HanjaCharacter.objects.create(pk="犯", meaning_reading="범할 범", strokes=1)
    cls.character5 = HanjaCharacter.objects.create(pk="侵", meaning_reading="침노할 침", strokes=1)
      
    cls.user = DictionaryUser.objects.create_user(username="test_user", password="test_user")
    
    # user does not have anything added to their list of known words

  def setUp(self):
    self.client = APIClient()
    self.user = TestHanjaGameNoKnownWords.user
    self.token = AuthToken.objects.create(user=self.user)[1]
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)

  def test_returns_error(self):
    length = 3
    seed = 0
    response = self.client.get(API_ENDPOINT, {'length': length, 'seed': seed})
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
  
class TestHanjaGamePathLengthTooLong(TestCase):

  @classmethod
  def setUpTestData(cls):
    
    # with three words 인심, 미인, 일인, , it will have to backtrack if it picks 인심 and then 미인
    # but still end up using 인 to continue the path (with 범인)
    cls.word1 = KoreanWord.objects.create(target_code=1, word="인심", origin="人心")
    cls.word2 = KoreanWord.objects.create(target_code=2, word="미인", origin="美人")
    cls.word3 = KoreanWord.objects.create(target_code=3, word="범인", origin="犯人")
    cls.word4 = KoreanWord.objects.create(target_code=4, word="침범", origin="侵犯")
    # purpose of word 4 is to make sure there are at least 16 characters for the view to return
    cls.word5 = KoreanWord.objects.create(target_code=5, word="뭐뭐뭐", origin="零一二三四五六七八九十百千月火水木金土日")

    cls.character1 = HanjaCharacter.objects.create(pk="心", meaning_reading="마음 심", strokes=1)
    cls.character2 = HanjaCharacter.objects.create(pk="人", meaning_reading="사람 인", strokes=1)
    cls.character3 = HanjaCharacter.objects.create(pk="美", meaning_reading="아름다울 미", strokes=1)
    cls.character4 = HanjaCharacter.objects.create(pk="犯", meaning_reading="범할 범", strokes=1)
    cls.character5 = HanjaCharacter.objects.create(pk="侵", meaning_reading="침노할 침", strokes=1)
      
    cls.user = DictionaryUser.objects.create_user(username="test_user", password="test_user")

    cls.user.known_words.set([cls.word1, cls.word2, cls.word3, cls.word4, cls.word5])

  def setUp(self):
    self.client = APIClient()
    self.user = TestHanjaGamePathLengthTooLong.user
    self.token = AuthToken.objects.create(user=self.user)[1]
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)

  def test_returns_error(self):
    # cannot find any path of length 10
    length = 10
    seed = 0
    response = self.client.get(API_ENDPOINT, {'length': length, 'seed': seed})
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class TestHanjaGameCharactersNotInDictionary(TestCase):
  @classmethod
  def setUpTestData(cls):
    
    # with three words 인심, 미인, 일인, , it will have to backtrack if it picks 인심 and then 미인
    # but still end up using 인 to continue the path (with 범인)
    cls.word1 = KoreanWord.objects.create(target_code=1, word="인심", origin="人心")
    cls.word2 = KoreanWord.objects.create(target_code=2, word="미인", origin="美人")
    cls.word3 = KoreanWord.objects.create(target_code=3, word="범인", origin="犯人")
    cls.word4 = KoreanWord.objects.create(target_code=4, word="침범", origin="侵犯")
    # purpose of word 4 is to make sure there are at least 16 characters for the view to return
    cls.word5 = KoreanWord.objects.create(target_code=5, word="뭐뭐뭐", origin="零一二三四五六七八九十百千月火水木金土日")

    cls.character1 = HanjaCharacter.objects.create(pk="心", meaning_reading="마음 심", strokes=1)
    #cls.character2 = HanjaCharacter.objects.create(pk="人", meaning_reading="사람 인", strokes=1)
    cls.character3 = HanjaCharacter.objects.create(pk="美", meaning_reading="아름다울 미", strokes=1)
    cls.character4 = HanjaCharacter.objects.create(pk="犯", meaning_reading="범할 범", strokes=1)
    
    # Similar to the no known words test case but the characters in the dictionary
    # cannot allow for all of the characters in the path
    cls.character5 = HanjaCharacter.objects.create(pk="侵", meaning_reading="침노할 침", strokes=1)
      
    cls.user = DictionaryUser.objects.create_user(username="test_user", password="test_user")
    
    # user does not have anything added to their list of known words

  def setUp(self):
    self.client = APIClient()
    self.user = TestHanjaGameCharactersNotInDictionary.user
    self.token = AuthToken.objects.create(user=self.user)[1]
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)

  def test_returns_error(self):
    length = 3
    seed = 0
    response = self.client.get(API_ENDPOINT, {'length': length, 'seed': seed})
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class TestCharactersSuppliedInSameOrder(TestCase):

  @classmethod
  def setUpTestData(cls):
    
    # with three words 인심, 미인, 미녀, it will have to backtrack if 미인 is the first
    # selected word in the path
    cls.word1 = KoreanWord.objects.create(target_code=1, word="인심", origin="人心")
    cls.word2 = KoreanWord.objects.create(target_code=2, word="미인", origin="美人")
    cls.word3 = KoreanWord.objects.create(target_code=3, word="미녀", origin="美女")
    
    # purpose of words 4-7 is to make sure there are at least 16 characters for the view to return
    cls.word4 = KoreanWord.objects.create(target_code=4, word="뭐뭐뭐", origin="零一二百千東西南北向上主氣月火水木金土日")
    cls.word5 = KoreanWord.objects.create(target_code=5, word="뭐뭐뭐", origin="零一二三四西南北向上五六七八金土日")
    cls.word6 = KoreanWord.objects.create(target_code=6, word="뭐뭐뭐", origin="十百千月火水木金土日")
    cls.word7 = KoreanWord.objects.create(target_code=7, word="뭐뭐뭐", origin="零一西南北向上二三四五六日")

    cls.character1 = HanjaCharacter.objects.create(pk="心", meaning_reading="마음 심", strokes=1)
    cls.character2 = HanjaCharacter.objects.create(pk="人", meaning_reading="사람 인", strokes=1)
    cls.character3 = HanjaCharacter.objects.create(pk="美", meaning_reading="아름다울 미", strokes=1)
    cls.character4 = HanjaCharacter.objects.create(pk="女", meaning_reading="계집 녀", strokes=1)
      
    cls.user = DictionaryUser.objects.create_user(username="test_user", password="test_user")
    cls.user.known_words.set([cls.word1, cls.word2, cls.word3, cls.word4, cls.word5, cls.word6, cls.word7])

  def setUp(self):
    self.client = APIClient()
    self.user = TestCharactersSuppliedInSameOrder.user
    self.token = AuthToken.objects.create(user=self.user)[1]
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)

  def test_triple(self):
    length = 3

    for seed in range (0, 7):
      with self.subTest(seed=seed):
        
        supplied_lists = []
        for _ in range (10):
          response = self.client.get(API_ENDPOINT, {'length': length, 'seed': seed})
          
          self.assertEqual(response.status_code, status.HTTP_200_OK)
          data = response.json()
          self.assertEqual(len(data['hanja_path']), length)
          self.assertIn("supplied_characters", data)

          supplied_lists.append(data['supplied_characters'])
        
        def listsAreSameOrder(list1, list2):

          if len(list1) != len(list2):
            return False

          for i in range (len(list1)):
            if list1[i] != list2[i]:
              return False
          
          return True

        for i in range (1, len(supplied_lists)):
          self.assertTrue(listsAreSameOrder(supplied_lists[0], supplied_lists[i]),
                          f"List {i} not equal to list 0; list 0: " + str(supplied_lists[0])
                          + f"~ list {i}: " + str(supplied_lists[i]))