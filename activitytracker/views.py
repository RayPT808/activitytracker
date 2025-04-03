import logging
from datetime import timedelta
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404, redirect, render
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .forms import ActivityForm, UserProfileForm
from .models import Activity, ChangeHistory
from .serializers import ActivitySerializer
from .serializers import UserSerializer


logger = logging.getLogger(__name__)


# Utility to get CSRF token
def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})


# Basic Home Page
def home(request):
    return render(request, "activitytracker/base.html")


# About Page
def about(request):
    return render(request, "activitytracker/about.html")

def register(request):
    return render(request, "activitytracker/register.html")



# Login API Endpoint
@api_view(["POST"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        refresh = RefreshToken.for_user(user)
        return Response({"refresh": str(refresh), "access": str(refresh.access_token)})
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


# Serializer-Based Registration API Endpoint
class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logger.info("Incoming registration request: %s", request.data)
        serializer = UserRegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            logger.info("User registered successfully: %s", user.username)
            return Response(
                {"message": "User registered successfully!"},
                status=status.HTTP_201_CREATED,
            )
        logger.error("Registration failed: %s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Dashboard Page
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
    return render(
        request,
        "activitytracker/dashboard.html",
        {"form": form, "activities": activities},
    )


# Profile Page
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


# Activity Record API Endpoint
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def record_activity(request):
    form = ActivityForm(request.data)
    if form.is_valid():
        activity = form.save(commit=False)
        activity.user = request.user
        activity.save()
        return Response({"message": "Activity recorded successfully"}, status=status.HTTP_201_CREATED)
    else:
        return Response({"errors": form.errors}, status=status.HTTP_400_BAD_REQUEST)


# Activity Log API Endpoint
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def activity_log(request):
    activities = Activity.objects.filter(user=request.user)
    serializer = ActivitySerializer(activities, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Update Activity API
@login_required
def update_activity(request, pk):
    activity = get_object_or_404(Activity, pk=pk, user=request.user)

    if request.method == "POST":
        form = ActivityForm(request.POST, instance=activity)
        if form.is_valid():
            updated_activity = form.save()

            if form.has_changed():
                changed_fields = form.changed_data
                change_description = "; ".join([f"{field} changed" for field in changed_fields])

                ChangeHistory.objects.create(
                    activity=updated_activity, change_description=change_description
                )

            updated_activity.save()
            return redirect("activity_list")
    else:
        form = ActivityForm(instance=activity)

    return render(request, "activitytracker/update_activity.html", {"form": form})


# Delete Activity API
@login_required
def delete_activity(request, pk):
    activity = get_object_or_404(Activity, pk=pk, user=request.user)
    if request.method == "POST":
        activity.delete()
        return redirect("activity_list")

    return render(request, "activitytracker/delete_activity.html", {"activity": activity})


# User Logout Function
def user_logout(request):
    logout(request)
    return redirect("home")


# Activity ViewSet for DRF
class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


# Activity List/Creation View
class ActivityListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        activities = request.user.activities.all()
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ActivitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("❌ Activity validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Activity Retrieve/Update/Delete View
class ActivityRetrieveUpdateDestroyView(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


@api_view(["POST"])
def logout_view(request):
    response = Response({"message": "Logged out successfully"}, status=200)
    response.delete_cookie("jwt")  # Delete JWT cookie if using cookies
    return response