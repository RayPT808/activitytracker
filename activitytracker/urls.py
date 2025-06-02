from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter

from activitytracker.views import (
    RegisterView, login_view, logout_view, get_csrf_token,
     about, dashboard, register_page, profile,
    ActivityListCreateView, update_activity, delete_activity, record_activity,
    user_profile,
)

from .views import register_user




urlpatterns = [
    # API Endpoints
    path("api/register/", RegisterView.as_view(), name="user_registration"),
    path("api/login/", login_view, name="login"),
    path('api/profile/', user_profile, name='user-profile'),
    path("api/activities/", ActivityListCreateView.as_view(), name="activity-list-create"),
    path("api/logout/", logout_view, name="logout"),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),  
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    

    # Activity Actions
    path("update/<int:pk>/", update_activity, name="update_activity"),
    path("delete_activity/<int:pk>/", delete_activity, name="delete_activity"),
    path("record/", record_activity, name="record_activity"),

    
]


