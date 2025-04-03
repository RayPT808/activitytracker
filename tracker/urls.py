from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView
from .views import get_csrf_token
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

from activitytracker import views as activitytracker_views


from activitytracker.views import get_csrf_token, login_view, RegisterView, user_profile

urlpatterns = [
    path("", activitytracker_views.home, name="home"),
    path("home/", activitytracker_views.home, name="home_redirect"),
    path("admin/", admin.site.urls),
    path("api/register/", RegisterView.as_view(), name="user_registration"),
    path('api/profile/', user_profile, name='user-profile'),
    path("api/users/", include("users.urls")),
    path("api/activitytracker/", include("activitytracker.urls")),
    path("api/login/", login_view, name="api-login"),
    path("accounts/", include("django.contrib.auth.urls")),
    path("api/activities/", activitytracker_views.ActivityListCreateView.as_view(), name="activity-list-create"),
    path('accounts/csrf/', get_csrf_token, name='get-csrf-token'),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/csrf/", get_csrf_token, name="get_csrf_token"),
    
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


handler404 = TemplateView.as_view(template_name="index.html")
