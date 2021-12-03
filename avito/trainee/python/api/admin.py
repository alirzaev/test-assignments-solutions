from django.contrib import admin

from .models import Ad, Photo

admin.site.register((Ad, Photo,))
