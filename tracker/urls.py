from django.contrib import admin
from django.urls import path, include
from activitytracker import views as activitytracker_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', activitytracker_views.home, name='home'),
    path('home/', activitytracker_views.home, name='home'), # Home page
    path('admin/', admin.site.urls),  # Admin panel
    path('activitytracker/record/', activitytracker_views.record_activity, name='record_activity'),  # Record activity
    path('activitytracker/list/', activitytracker_views.activity_list, name='activity_list'),  # List activities
    path('update/<int:pk>/', activitytracker_views.update_activity, name='update_activity'),  # Update activity
    path('activitytracker/', include('activitytracker.urls')),  # Include app URLs
    path('accounts/', include('django.contrib.auth.urls')),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
