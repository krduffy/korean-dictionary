from django.core.management.base import BaseCommand
from ...models import Setting

class Command(BaseCommand):
  def add_arguments(self, parser):
    parser.add_argument('status', type=str, choices=['available', 'unavailable'])

  def handle(self, *args, **options):
    status = options['status']
    Setting.set_setting('DB_AVAILABLE', status)
    self.stdout.write(self.style.SUCCESS(f'Successfully set db availability status to {status}'))