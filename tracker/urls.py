from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

from activitytracker import views as activitytracker_views

from .views import get_csrf_token, login_view

urlpatterns = [
    path("", activitytracker_views.home, name="home"),
    path("home/", activitytracker_views.home, name="home_redirect"),
    path("admin/", admin.site.urls),
    path("api/users/", include("users.urls")),
    path("api/activitytracker/", include("activitytracker.urls")),
    path("api/login/", login_view, name="api-login"),
    path("accounts/", include("django.contrib.auth.urls")),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("csrf/", get_csrf_token, name="get_csrf_token"),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


handler404 = TemplateView.as_view(template_name="index.html")
