from django.contrib import admin
from django.urls import path
from activitytracker import views as activitytracker_views
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),  # Admin panel
    path('activitytracker/', activitytracker_views.my_activitytracker, name='my_activitytracker'),  # Root activity tracker page
    path('activitytracker/record/', activitytracker_views.record_activity, name='record_activity'),  # Record activity
    path('activitytracker/list/', activitytracker_views.activity_list, name='activity_list'), # List activities (add this view)
    path('update/<int:pk>/', views.update_activity, name='update_activity'),  
]


