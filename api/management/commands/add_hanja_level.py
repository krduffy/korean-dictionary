from django.core.management.base import BaseCommand, no_translations
from ...dictionary_models import HanjaCharacter
import django

django.setup()

class Command(BaseCommand):

  @no_translations
  def handle(self, *args, **kwargs):

    self.stdout.write(f'Need to process {len(HanjaCharacter.objects.all())} characters.')
    
    updated = 0
    processed = 0

    chars_to_update = []

    for character_object in HanjaCharacter.objects.all():

      def get_exam_rank_num(exam_rank):

        exam_rank_num = -1
    
        try:
          exam_rank_num = 2 * int(exam_rank[-2])
        except ValueError:
          pass
        if exam_rank.startswith('준'):
          exam_rank_num += 1
        if '특' in exam_rank:
          exam_rank_num += 1
        
        return exam_rank_num
      
      character_object.result_ranking = get_exam_rank_num(character_object.exam_level)
      chars_to_update.append(character_object)

      processed += 1
      if processed % 500 == 0:
        self.stdout.write(f'Processed {processed} characters')
    
    updated = HanjaCharacter.objects.bulk_update(chars_to_update, ['result_ranking'], batch_size=1000)

    self.stdout.write(self.style.SUCCESS(f'Successfully finished executing command; updated {updated} characters'))