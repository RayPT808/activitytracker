from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('dashboard/', views.dashboard, name='dashboard'), 
    path('record/', views.record_activity, name='record_activity'),  # Record new activity
    path('list/', views.activity_list, name='activity_list'),  # View list of activities
    path('update/<int:pk>/', views.update_activity, name='update_activity'),
    path('delete_activity/<int:pk>/', views.delete_activity, name='delete_activity'),
  
]
