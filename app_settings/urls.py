from django.urls import path
from .views import CheckAvailabilityView

urlpatterns = [
  path('check_availability/', CheckAvailabilityView.as_view()),
]