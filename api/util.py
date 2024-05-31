from django.db.models import IntegerField, F, ExpressionWrapper
from django.db.models import Case, When, Value, BooleanField
from django.db.models.functions import Length

from konlpy.tag import Kkma

# Removes any words that were not created by the user from a queryset of KoreanWords.
# A creator of None is also allowed since this indicates that the base dictionary (from
# 우리말샘 urimalsaem) provided the word.
def remove_non_user_additions(queryset, allowed_user):
  queryset = queryset.filter(creator=None) | queryset.filter(creator=allowed_user)
  return queryset

def remove_all_user_additions(queryset):
  queryset = queryset.filter(creator=None)
  return queryset

def prioritize_known_or_studying(queryset, user):
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

