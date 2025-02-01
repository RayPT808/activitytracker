from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from activitytracker import views
from .views import login_view
from .views import RegisterView


urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/activities/', views.ActivityListCreateView.as_view(), name='activity-list-create'),
    path('api/activities/<int:pk>/', views.ActivityRetrieveUpdateDestroyView.as_view(), name='activity-detail'),
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('register/', views.register, name='register'),
    path('login/', login_view, name='login'),  
    #path('api/login/', login_view, name='api-login'),
    #path('accounts/login/', auth_views.LoginView.as_view(), name='login'),
    path('accounts/logout/', auth_views.LogoutView.as_view(next_page='home'), name='logout'),
    path('accounts/register/', views.register, name='register'),
    path('accounts/profile/', views.profile, name='profile'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('record/', views.record_activity, name='record_activity'),
    path('list/', views.activity_list, name='activity_list'),
    path('update/<int:pk>/', views.update_activity, name='update_activity'),
    path('delete_activity/<int:pk>/', views.delete_activity, name='delete_activity'),
]
