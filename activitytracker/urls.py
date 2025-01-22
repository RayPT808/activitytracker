from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('register/', views.register, name='register'),  
    path('record/', views.record_activity, name='record_activity'),  # Record new activity
    path('list/', views.activity_list, name='activity_list'),  # View list of activities
    path('update/<int:pk>/', views.update_activity, name='update_activity'),  # Update activity
]
