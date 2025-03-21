from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from activitytracker import views
from .views import home, login_view, get_csrf_token, RegisterView, activity_log
from .views import RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('api/get_csrf_token/', get_csrf_token, name='get_csrf_token'),
    path('api/register/', RegisterView.as_view(), name='user_registration'),
    path('api/activities/', views.ActivityListCreateView.as_view(), name='activity-create'),
    path('api/activities/<int:pk>/', views.ActivityRetrieveUpdateDestroyView.as_view(), name='activity-detail'),
    path('', home, name='home'),
    path('about/', views.about, name='about'),
    path('register/', views.register, name='register'),
    path('api/login/', login_view, name='login'),
    path('accounts/logout/', auth_views.LogoutView.as_view(next_page='home'), name='logout'),
    path('accounts/register/', views.register, name='account_register'),
    path('accounts/profile/', views.profile, name='profile'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('record/', views.record_activity, name='record_activity'),
    path('list/', views.activity_list, name='activity-log'),
    path('update/<int:pk>/', views.update_activity, name='update_activity'),
    path('delete_activity/<int:pk>/', views.delete_activity, name='delete_activity'),
    path('api/activities/', views.ActivityListCreateView.as_view(), name='activity-create'),
    path('activity-log/', activity_log, name='activity-log'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 


]

