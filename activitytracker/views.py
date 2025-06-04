import logging
from datetime import timedelta
from django.contrib.auth import authenticate, login 
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404, redirect, render
from django.utils.timezone import now
from django.views.generic import TemplateView
from rest_framework import generics, permissions, serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator


from .forms import ActivityForm, UserProfileForm
from .models import Activity
from .serializers import ActivitySerializer, UserSerializer, UserRegisterSerializer

logger = logging.getLogger(__name__)

# ------------------- Utility -------------------
def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})


# ------------------- Pages -------------------

def about(request):
    return render(request, "activitytracker/about.html")


def register_page(request):
    return render(request, "activitytracker/register.html")


def redirect_to_frontend(request):
    return redirect('/about/')

@method_decorator(never_cache, name='dispatch')
class FrontendAppView(TemplateView):
    template_name = "index.html"



def register_user(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("login")  # or wherever you want
    else:
        form = UserCreationForm()

    return render(request, "activitytracker/register.html", {"form": form})


@login_required
def profile(request):
    if request.method == "POST":
        form = UserProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect("profile")
    else:
        form = UserProfileForm(instance=request.user)

    return render(request, "activitytracker/profile.html", {"form": form})


# ------------------- Authentication -------------------
@api_view(["POST"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        refresh = RefreshToken.for_user(user)
        return Response({"refresh": str(refresh), "access": str(refresh.access_token)})
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(["POST"])
def logout_view(request):
    response = Response({"message": "Logged out successfully"}, status=200)
    response.delete_cookie("jwt")
    return response



class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------- User Profile API -------------------
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# ------------------- Activity APIs -------------------
class ActivityListCreateView(generics.ListCreateAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Activity.objects.filter(user=self.request.user).order_by("-date")

    def perform_create(self, serializer):
        logger.info("Payload received for activity creation: %s", self.request.data)
        try:
            serializer.save(user=self.request.user)
            logger.info("Activity successfully saved for user %s", self.request.user)
        except Exception as e:
            logger.error("Error saving activity: %s", str(e))
            raise


class ActivityDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Activity.objects.filter(user=self.request.user)


# ------------------- Legacy Django views (optional) -------------------
@login_required
def dashboard(request):
    if request.method == "POST":
        form = ActivityForm(request.POST)
        if form.is_valid():
            activity = form.save(commit=False)
            activity.user = request.user
            activity.save()
            return redirect("dashboard")
    else:
        form = ActivityForm()

    activities = request.user.activities.all().order_by("-date")
    return render(request, "activitytracker/dashboard.html", {"form": form, "activities": activities})


@login_required
def update_activity(request, pk):
    activity = get_object_or_404(Activity, pk=pk, user=request.user)

    if request.method == "POST":
        form = ActivityForm(request.POST, instance=activity)
        if form.is_valid():
            form.save()
            return redirect("dashboard") 
    else:
        form = ActivityForm(instance=activity)

    return render(request, "activitytracker/update_activity.html", {"form": form})


@login_required
def delete_activity(request, pk):
    activity = get_object_or_404(Activity, pk=pk, user=request.user)
    if request.method == "POST":
        activity.delete()
        return redirect("dashboard") 
    return render(request, "activitytracker/delete_activity.html", {"activity": activity})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def record_activity(request):
    form = ActivityForm(request.data)
    if form.is_valid():
        activity = form.save(commit=False)
        activity.user = request.user
        activity.save()
        return Response({"message": "Activity recorded successfully"}, status=201)
    return Response({"errors": form.errors}, status=400)


