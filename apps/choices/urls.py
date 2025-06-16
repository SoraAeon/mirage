from django.urls import path
from .views import UserChoicesView

urlpatterns = [
    path('user-choices/', UserChoicesView.as_view(), name='user-choices'),
]
