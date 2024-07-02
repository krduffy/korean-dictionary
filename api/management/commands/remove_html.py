from django.core.management.base import BaseCommand, no_translations
from ...dictionary_models import Sense
from django.db.models import Q
from django.db import transaction
import django
import re

django.setup()

#deletes almost all of the html. there are also random typos in the dataset like wrong order </l><l>
#(not more than 15) that need to be updated manually
class Command(BaseCommand):

  @no_translations
  def handle(self, *args, **kwargs):
    
    
    html_patterns = [
        # outright deleted
        '<I>', '</I>', '<sub>', '</sub>', '<sup>', '</sup>', '<IN>', '</IN>',
        '<span class="korean-webfont">', '<span class="ngullim">', '</span>', '<FL>', '</FL>', 
        '<strong>', '</strong>', '<i>', '</i>'
    ]

    q_filter = Q()
    for pattern in html_patterns:
        q_filter |= Q(definition__contains=pattern)

    # not deleted outright; of the form <sense_no>\d*</sense_no> so needs to be subbed with re module
    q_filter |= Q(definition__contains='<sense_no>')

    senses_to_update = Sense.objects.filter(q_filter)

    updated = 0
    total = senses_to_update.count()
    
    self.stdout.write(f'Found {total} senses to process.')

    batch_size = 1000
    senses_to_save = []

    with transaction.atomic():
        for sense in senses_to_update:
            original_definition = sense.definition
            new_definition = original_definition

            new_definition = re.sub(r'<sense_no>\d*</sense_no>', '', new_definition)

            for pattern in html_patterns:
                new_definition = new_definition.replace(pattern, '')

            if new_definition != original_definition:
                sense.definition = new_definition
                senses_to_save.append(sense)
                updated += 1

            if len(senses_to_save) >= batch_size:
                Sense.objects.bulk_update(senses_to_save, ['definition'])
                senses_to_save = []
                self.stdout.write(f'Updated {updated} senses so far.')

        if senses_to_save:
            Sense.objects.bulk_update(senses_to_save, ['definition'])

    self.stdout.write(self.style.SUCCESS(f'Successfully finished executing command'))