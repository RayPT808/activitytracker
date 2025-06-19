from django.urls import path

from activitytracker.views import (ActivityDetailView, ActivityListCreateView,
                                   RegisterView, about, dashboard,
                                   delete_activity, login_view, logout_view,
                                   profile, record_activity, register_page,
                                   update_activity, user_profile)

urlpatterns = [
    # API Endpoints (no 'api/' prefix here)
    path("register/", RegisterView.as_view(), name="user_registration"),
    path("login/", login_view, name="login"),
    path("profile/", user_profile, name="user-profile"),
    path("activities/", ActivityListCreateView.as_view(), name="activity-list-create"),
    path("activities/<int:pk>/", ActivityDetailView.as_view(), name="activity-detail"),
    path("update/<int:pk>/", update_activity, name="update_activity"),
    path("delete/<int:pk>/", delete_activity, name="delete_activity"),
    path("logout/", logout_view, name="logout"),
    path("record/", record_activity, name="record_activity"),
    # Other views
    path("dashboard/", dashboard, name="dashboard"),
    path("register-page/", register_page, name="register"),
    path("profile-page/", profile, name="profile"),
    path("about/", about, name="about"),
]
