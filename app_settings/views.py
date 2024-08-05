from django.http import JsonResponse
from .models import Setting
from rest_framework.views import APIView

class CheckAvailabilityView(APIView):
    
    def get(self, *args, **kwargs):
      availability = Setting.get_setting('DB_AVAILABLE', 'unavailable')
      if availability == "available":
          return JsonResponse({"status": "available"}, status=200)
      else:
          return JsonResponse({"status": "unavailable"}, status=503)