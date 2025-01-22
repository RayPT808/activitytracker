from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from activitytracker import views as activitytracker_views

urlpatterns = [
    path('', activitytracker_views.home, name='home'),  # Home page
    path('home/', activitytracker_views.home, name='home_redirect'),  # Redirect home
    path('admin/', admin.site.urls),  # Admin panel
    path('activitytracker/', include('activitytracker.urls')),  # Include app URLs
    path('accounts/', include('django.contrib.auth.urls')),  # Django auth system
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
