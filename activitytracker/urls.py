from django.contrib import admin

from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from activitytracker.views import (
    RegisterView, login_view, get_csrf_token, home, about, 
    dashboard, ActivityListCreateView, profile,
    logout_view,
)
from activitytracker import views



urlpatterns = [
    # API Endpoints
    path("api/register/", RegisterView.as_view(), name="user_registration"),
    path("api/login/", login_view, name="login"),
    path('api/profile/', views.user_profile, name='user-profile'),
    path("api/activities/", ActivityListCreateView.as_view(), name="activity-list-create"),
    path('admin/', admin.site.urls), 
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),  
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/logout/", logout_view, name="logout"),

    # Frontend Pages
    path("", home, name="home"),
    path("about/", about, name="about"),
    path("dashboard/", dashboard, name="dashboard"),
    path("register/", RegisterView.as_view(), name="register"),  

    # Authentication
    path("accounts/profile/", profile, name="profile"),

]
