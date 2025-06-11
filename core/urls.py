from django import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.worldmap.views import AreaViewSet, UserLocationViewSet
from apps.community.views import MessageViewSet

router = DefaultRouter()
router.register(r'areas', AreaViewSet)
router.register(r'user-locations', UserLocationViewSet, basename='userlocation')
router.register(r'messages', MessageViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    # path('', TemplateView.as_view(template_name='home.html'), name='home'),
    # path('accounts/', include('apps.accounts.urls')),
    # path('concepts/', include('apps.concepts.urls')),
    # path('dialogues/', include('apps.dialogues.urls')),
    # path('summaries/', include('apps.summaries.urls')),

    # path('community/', include('apps.community.urls')),
    # path('feedback/', include('apps.feedback.urls')),
    # path('quests/', include('apps.quests.urls')),
    # path('ranking/', include('apps.ranking.urls')),
    # path('worldmap/', include('apps.worldmap.urls')),
]

# ★開発環境時のみ MEDIA_URL → MEDIA_ROOT を配信するよう指定
from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)