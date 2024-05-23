from django.db import models

from dictionary_users.models import DictionaryUser

class KoreanWord(models.Model):
  # A "word" is a group of senses that allude to the same fundamental meaning.
  target_code = models.IntegerField(primary_key = True)
  
  # This word and its origin.
  # For example, word can be 단어 while origin is 單語
  word = models.CharField(max_length = 100)
  origin = models.CharField(max_length = 100, default="")
  
  # Called word_unit in dictionary JSON files.
  # 'word_type' as defined in those files is both rarely useful and easily calculable using
  # the Unicode values of self.origin. 어휘, 속담, ...
  word_type = models.CharField(max_length = 3, default="")

  creator = models.ForeignKey(DictionaryUser, on_delete=models.CASCADE, 
                              related_name='created_words', default=None, null=True)
  known_by = models.ManyToManyField(DictionaryUser, related_name='known_words')
  studied_by = models.ManyToManyField(DictionaryUser, related_name='study_words')

  # Implicit foreign keys:
    # senses

  def __str__(self):
    return f"Word {self.word}, tc {self.target_code}"
  
  def save(self, *args, **kwargs):
    # Important for when user defines their own words
    if not self.pk:
      self.target_code = KoreanWord.objects.aggregate(
        lowest_value=models.Min('target_code'))['lowest_value'] - 1
      self.created_by_user = True
    super().save(*args, **kwargs)

# A sense is a "meaning" associated with a word.
# Multiple senses can refer to the same word.
class Sense(models.Model):
  # The unique identifier for this sense.
  target_code = models.IntegerField(primary_key = True)

  # The word that this sense refers to.
  referent = models.ForeignKey(KoreanWord, on_delete = models.CASCADE, related_name = "senses")
 
  # The definition (meaning) associated with this sense.
  definition = models.CharField(max_length = 1500)
  
  # The kind of meaning that this sense's definition falls under.
  # Examples include dialectal, 
  type = models.CharField(max_length = 3, default="")
  
  # The placement of this sense among all of the senses that refer to this sense's referent.
  order = models.SmallIntegerField(blank = False)

  # The category (sports, science, ...) that this sense is related to.
  category = models.CharField(max_length = 6, default="") # longest is six, tie including '고유명 일반'
  
  # Part of speech is optional; not stored as JSON to speed up queries
  pos = models.CharField(max_length = 6, default="")
  
  # JSONB fields for optional additional data.
  # Eight possible contained fields below
  # This information is only queried when the user inspects a word,
  # making it less important to have fast querying
  additional_info = models.JSONField(null = True, default = None)
  # patterns, relations, examples, norms, grammar, history, proverb, region
  # Can view full tree in korean-dictionary/api/management/dict_files/json_structure.txt

  creator = models.ForeignKey(DictionaryUser, on_delete=models.CASCADE, 
                              related_name='created_senses', default=None, null=True)

  def save(self, *args, **kwargs):
    # Important for when user defines their own senses
    if not self.pk:
      self.target_code = Sense.objects.aggregate(
        lowest_value=models.Min('target_code'))['lowest_value'] - 1
      self.created_by_user = True
    super().save(*args, **kwargs)

  def __str__(self):
    return f"Sense {self.definition}, ai {self.additional_info}"

class HanjaCharacter(models.Model):
  # This character. 金, 韓, 朴, 安 are examples of what might be in this field.
  character = models.CharField(primary_key = True, max_length = 1)

  # 이 한자의 훈음. The meaning(s) and reading(s) associated with this character. 
  meaning_reading = models.CharField(blank = False)

  # 이 한자의 모양자 분해. '⿱逢？'는 예일 수 있다.
  decomposition = models.CharField(default="")

  # 이 한자의 부수. 예를 들어서 災 재앙 재의 부수는 火입니다
  # 부수는 분해 중에 반드시 있을 겁니다.
  radical = models.CharField(default="")

  # 이 한자의 획수.
  strokes = models.SmallIntegerField(default=None)

  # 고등학교, 미배정이 예일 수 있습니다
  grade_level = models.CharField(default="")

  # 한국의 한자 검정시험 기준으로, 이 한자의 급. 8급 등이 있습니다.
  exam_level = models.CharField(default="")

  # 검색할 때 이 한자의 비중. exam_level 높을수록 이 변수도 높아집니다
  result_ranking = models.SmallIntegerField(default=-1)

  # 이 한자의 설명. 이해에 있어서 도움될 수는 있지만 나무위키 출처이니 공통화되지 않아 있습니다.
  # 한자한자 마디 설명이 많이 다를 수 있습니다.
  explanation = models.CharField(default="")