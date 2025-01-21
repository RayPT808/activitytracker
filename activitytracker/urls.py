from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),  # Activity tracker home page
    path('record/', views.record_activity, name='record_activity'),  # Record new activity
    path('list/', views.activity_list, name='activity_list'),  # View list of activities
    path('update/<int:pk>/', views.update_activity, name='update_activity'),  # Update activity
]
