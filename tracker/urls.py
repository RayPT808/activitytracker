from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from activitytracker import views as activitytracker_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('', activitytracker_views.home, name='home'),  
    path('home/', activitytracker_views.home, name='home_redirect'),  
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/users/', include('users.urls')), 
    path('api/activitytracker/', include('activitytracker.urls')),  # Fixed the issue
    
    path('accounts/', include('django.contrib.auth.urls')),  # Django built-in auth URLs

    # JWT authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Serve static/media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
