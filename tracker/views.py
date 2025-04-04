from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse  # Import JsonResponse
from django.middleware.csrf import get_token  # Import get_token
from django.views.decorators.csrf import ensure_csrf_cookie






def get_csrf_token(request):
    """
    View to get the CSRF token for AJAX requests
    """
    csrf_token = get_token(request)
    return JsonResponse({"csrf_token": csrf_token})


@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'csrfToken': request.META.get("CSRF_COOKIE", "")})


@api_view(["POST", "OPTIONS"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        )
    else:
        return Response({"error": "Invalid credentials"}, status=401)




@api_view(["POST","OPTIONS"])
def logout_view(request):
    """
    Logout API to blacklist the refresh token
    """
    try:
        refresh_token = request.data.get("refresh_token")  # Get refresh token from request
        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=400)
        
        token = RefreshToken(refresh_token)  # Create a RefreshToken instance
        token.blacklist()  # Blacklist the token

        return Response({"message": "Logged out successfully"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


