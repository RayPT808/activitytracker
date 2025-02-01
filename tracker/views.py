from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.tokens import RefreshToken

#from django.http import JsonResponse
#from django.middleware.csrf import get_token

def get_csrf_token(request):
    """
    View to get the CSRF token for AJAX requests
    """
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})


@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)  # Optional if you're managing sessions in the backend
        
        # Create JWT token
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=401)
