from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from activitytracker import views as activitytracker_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import get_csrf_token
from .views import login_view

urlpatterns = [
    path('', activitytracker_views.home, name='home'),  # Keep this as the root path
    path('home/', activitytracker_views.home, name='home_redirect'),
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/users/', include('users.urls')),
    path('api/activitytracker/', include('activitytracker.urls')),
    path('api/login/', login_view, name='api-login'),

    path('accounts/', include('django.contrib.auth.urls')),  # Django built-in auth URLs

    # JWT authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('csrf/', get_csrf_token, name='get_csrf_token'),

    # Template for the home page, if needed
    # path('', TemplateView.as_view(template_name='index.html')),
]

# Serve static/media files in development (only needed if DEBUG is True)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# No need to add static file serving here, Django does this automatically in DEBUG mode
# urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

handler404 = TemplateView.as_view(template_name='index.html')
