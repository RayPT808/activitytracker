from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from activitytracker import views as activitytracker_views

urlpatterns = [
    path('', activitytracker_views.home, name='home'),  
    path('home/', activitytracker_views.home, name='home_redirect'),  
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')), 
    path('activitytracker/', include('activitytracker.urls')), 
    path('accounts/', include('django.contrib.auth.urls')),  
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
