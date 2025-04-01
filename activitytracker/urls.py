from django.urls import path, include
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from activitytracker.views import (
    RegisterView, login_view, get_csrf_token, 
    ActivityRetrieveUpdateDestroyView, home, about, 
    dashboard, activity_log, record_activity, 
    delete_activity, update_activity, profile,
    logout_view,

)

# Set up DRF router
router = DefaultRouter()
router.register(r'activities', ActivityRetrieveUpdateDestroyView, basename='activity')

urlpatterns = [
    # API Endpoints
    path('api/', include(router.urls)),
    path("api/get_csrf_token/", get_csrf_token, name="get_csrf_token"),
    path("api/register/", RegisterView.as_view(), name="user_registration"),
    path("api/login/", login_view, name="login"),  
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),  
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/logout/", logout_view, name="logout"),




    # Frontend Pages
    path("", home, name="home"),
    path("about/", about, name="about"),
    path("dashboard/", dashboard, name="dashboard"),
    path("register/", RegisterView.as_view(), name="register"),  # Use class-based view
    
    # Authentication
    path("accounts/logout/", auth_views.LogoutView.as_view(next_page="home"), name="logout"),
    path("accounts/profile/", profile, name="profile"),

    # Activity Management
    path("activity-log/", activity_log, name="activity-log"),
    path("record/", record_activity, name="record_activity"),
    path("delete_activity/<int:pk>/", delete_activity, name="delete_activity"),
    path("update/<int:pk>/", update_activity, name="update_activity"),
]
