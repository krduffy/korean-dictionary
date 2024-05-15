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
  meaning_reading = models.CharField(max_length = 30) # Longest is for character '閄'