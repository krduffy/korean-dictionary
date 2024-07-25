from django.core.management.base import BaseCommand, no_translations
from dictionary_users.views import CreateUserAPI
from dictionary_users.models import DictionaryUser
from api.dictionary_models import KoreanWord
import django
from django.test import RequestFactory

django.setup()

class Command(BaseCommand):

  @no_translations
  def handle(self, *args, **kwargs):

    factory = RequestFactory()
    request = factory.post('/create_user/', {
      'username': '척척박사',
      'password': 'secret',
    })

    view = CreateUserAPI.as_view()
    response = view(request)

    if response.status_code == 201:
      self.stdout.write(self.style.SUCCESS(f'Test user created successfully'))

      created_user = DictionaryUser.objects.filter(username = '척척박사').first()
      created_user.known_words.set(KoreanWord.objects.all())
      created_user.save()

      self.stdout.write(self.style.SUCCESS(f'Test user knows all words'))
    else:
      self.stdout.write(self.style.ERROR(f'Error creating superuser: {response.data}'))