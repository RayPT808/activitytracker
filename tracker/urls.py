from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

from activitytracker import views as activitytracker_views
from activitytracker.views import (FrontendAppView, RegisterView, login_view,
                                   user_profile)

from .views import get_csrf_token

urlpatterns = [
    path("", activitytracker_views.about, name="about_redirect"),
    path("admin/", admin.site.urls),
    path("api/register/", RegisterView.as_view(), name="user_registration"),
    path("api/profile/", user_profile, name="user-profile"),
    path("api/users/", include("users.urls")),
    path("api/activitytracker/", include("activitytracker.urls")),
    path("api/login/", login_view, name="api-login"),
    path("accounts/", include("django.contrib.auth.urls")),
    path(
        "api/activities/<int:pk>/",
        activitytracker_views.ActivityDetailView.as_view(),
        name="activity-detail",
    ),
    path("api/accounts/csrf/", get_csrf_token, name="get-csrf-token"),
    path("accounts/csrf/", get_csrf_token, name="get-csrf-token-web"),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    re_path(
        r"^(?!api/|admin/|accounts/).*", FrontendAppView.as_view(), name="frontend"
    ),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
