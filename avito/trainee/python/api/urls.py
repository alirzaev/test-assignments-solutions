from rest_framework import routers

from .views import AdViewSet

router = routers.DefaultRouter()
router.register('ad', AdViewSet, basename='ad')

urlpatterns = router.urls
