from django.contrib import admin
from django.urls import path, include
from activitytracker import views as activitytracker_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),  # Admin panel
    path('activitytracker/', activitytracker_views.my_activitytracker, name='my_activitytracker'),  # Root activity tracker page
    path('activitytracker/record/', activitytracker_views.record_activity, name='record_activity'),  # Record activity
    path('activitytracker/list/', activitytracker_views.activity_list, name='activity_list'),  # List activities
    path('update/<int:pk>/', activitytracker_views.update_activity, name='update_activity'),  # Update activity
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
