from django.db.models import IntegerField, F, ExpressionWrapper
from django.db.models import Case, When, Value, BooleanField
from django.db.models.functions import Length

from konlpy.tag import Kkma

def get_only_user_additions(queryset, allowed_user):
  """
    A function to filter out all words not created by a specific user from a queryset.

    Parameters:
      - `queryset`: The queryset of words from which to retrieve only the user's created words.
      - `allowed_user`: The user whose words should be returned. 

    Returns: A queryset containing only words that `allowed_user` created.
  """
  queryset = queryset.filter(creator=allowed_user)
  return queryset

# Removes any words that were not created by the user from a queryset of KoreanWords.
# A creator of None is also allowed since this indicates that the base dictionary (from
# 우리말샘 urimalsaem) provided the word.
def remove_non_user_additions(queryset, allowed_user):
  """
    A function to filter out all words created by a user other than a given user from a queryset.
    Words in the base dictionary are still included in the returned queryset.
    
    Parameters:
      - `queryset`: The queryset of words from which to retrieve only the user's created words and base words.
      - `allowed_user`: The user whose words should be included in the returned queryset. 

    Returns: A queryset containing only words that `allowed_user` created or that were in the base dictionary.
  """
  queryset = queryset.filter(creator=None) | queryset.filter(creator=allowed_user)
  return queryset

def remove_all_user_additions(queryset):
  """
    A function to filter out all words not in the base dictionary from a queryset.
    
    Parameters:
      - `queryset`: The queryset of words from which to retrieve only base dictionary words.

    Returns: A queryset containing only words from the base dictionary.
  """
  queryset = queryset.filter(creator=None)
  return queryset

def prioritize_known_or_studying(queryset, user):
  """
    A function to move words known or studied by a given user to the top of a given queryset.
    
    Parameters:
      - `queryset`: The queryset of words to reorder.
      - `user`: The user whose data should be used in prioritization. 

    Returns: The reordered queryset.
  """
  known_words = user.known_words.all()
  study_words = user.study_words.all()

  new_queryset = None

  if known_words.exists() or study_words.exists():
      new_queryset = queryset.annotate(
          prioritized=Case(
              When(target_code__in=known_words, then=Value(True)),
              When(target_code__in=study_words, then=Value(True)),
              default=Value(False),
              output_field=BooleanField(),
          ),
          length=Length("word")
      ).order_by("-prioritized", "length", "target_code")

  return new_queryset if new_queryset else queryset

# "Randomizes" a queryset of KoreanWords.
# For purposes of idempotency, .order_by('?') cannot be used and python's random module cannot be
# used. The random module, even when seeded, hasn't worked due to the multithreaded nature of
# a server.
# This function's randomness is not strong at all. It reorders words according to the
# distance between their target_code and the provided seed (~approximately; there is also a modulus)
def reorder_queryset_with_seed(queryset, seed):
  """
    A function to reorder a queryset of KoreanWords with a given seed.
    
    Parameters:
      - `queryset`: The queryset of words to reorder.
      - `seed` (int, required): The seed to use during reordering.

    Returns: The reordered queryset.
  """
  def get_rel_index(target_code, seed):
    # Need the randomness to remain a database operation. So using random cannot work.
    # Using .order_by('?') is also not idempotent; needs to remain same even on rerenders
    # of the homepage component with the same seed
    x = (seed - target_code) % 1000
    return x * x

  queryset = queryset.annotate(
    rel_index = ExpressionWrapper(get_rel_index(F('target_code'), seed), output_field=IntegerField()),
  )
  queryset = queryset.order_by("rel_index", "-target_code")
  return queryset

# Returns the nouns and verbs in a sentence, as analyzed by Kkma (from the konlpy library).
def get_nouns_verbs(sentence):
  """
    A function to get nouns and verb lemmas from a given sentence.
    
    Parameters:
      - `sentence`: The sentence from which to extract nouns and verbs

    Returns: A tuple containing:
      - The list of nouns and verbs in the first position.
      - The list of all lemmas in the sentence in the second position.
  """
  def accept_pos(str):
    return str.startswith("N") or str.startswith("V") or str.startswith("M") or str == "XR" or str == "XSA" or str == "OL"
  
  def is_어근_followed_by_deriv_suffix(str1, str2):
    return (str1 == "XR" or str1 == 'NNG') and str2 == "XSA"

  kkma = Kkma()
  analysis = kkma.pos(sentence)

  accepted_lemmas = [item for item in analysis if accept_pos(item[1])]
  num_accepted_lemmas = len(accepted_lemmas)
  return_list = []

  for i in range(0, num_accepted_lemmas):
    
    if i != (num_accepted_lemmas - 1) and \
              is_어근_followed_by_deriv_suffix(accepted_lemmas[i][1], accepted_lemmas[i+1][1]):

      return_list.append((accepted_lemmas[i][0] + accepted_lemmas[i+1][0], 'V'))
    
    elif not accepted_lemmas[i][1] == 'XSA':
      return_list.append(accepted_lemmas[i])

  return (return_list, analysis)

