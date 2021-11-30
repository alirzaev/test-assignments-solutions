from django.urls import path

from .views import reset, save, show

urlpatterns = [
    path('show/', show, name='show'),
    path('save/', save, name='save'),
    path('reset/', reset, name='reset')
]
