from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_protect
from django.middleware.csrf import get_token
from django.utils.timezone import now
from datetime import timedelta

from .models import Activity, ChangeHistory
from .forms import ActivityForm
from .forms import CustomUserCreationForm
from .forms import UserProfileForm
from .serializers import ActivitySerializer

from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers

import xml.etree.ElementTree as ET





def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})



def home(request):
    return render(request, 'activitytracker/base.html')


def about(request):
    return render(request, 'activitytracker/about.html')



@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)  
        
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=401)
        

@csrf_protect
def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard')  
    else:
        form = CustomUserCreationForm()
    
    return render(request, 'activitytracker/register.html', {'form': form})


def my_activitytracker(request):
    return HttpResponse("Hello, Runner!")


@login_required
def dashboard(request):
    if request.method == 'POST':
        form = ActivityForm(request.POST)
        if form.is_valid():
            activity = form.save(commit=False)
            activity.user = request.user
            activity.save()
            return redirect('dashboard')
    else:
        form = ActivityForm()

    activities = request.user.activities.all().order_by('-date')
    return render(request, 'activitytracker/dashboard.html', {'form': form, 'activities': activities})


@login_required
def profile(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('profile') 
    else:
        form = UserProfileForm(instance=request.user)

    return render(request, 'activitytracker/profile.html', {'form': form})


@login_required
def record_activity(request):
    if request.method == 'POST':
        form = ActivityForm(request.POST, request.FILES)  # Ensure you pass request.FILES here
        if form.is_valid():
            activity = form.save(commit=False)
            activity.user = request.user  # Associate the activity with the current user

            # Process the file if it's uploaded
            uploaded_file = request.FILES.get('file')
            if uploaded_file:
                # Handle the file (e.g., .gpx or .fit) here
                if uploaded_file.name.endswith('.gpx'):
                    # Add GPX parsing logic here
                    pass
                elif uploaded_file.name.endswith('.fit'):
                    # Add FIT file parsing logic here
                    pass

            activity.save()  # Save the activity after processing
            return redirect('dashboard')

    else:
        form = ActivityForm()

    return render(request, 'activitytracker/dashboard.html', {'form': form})


@login_required
def activity_list(request):
    activities = request.user.activities.all()  # Get activities for the logged-in user
    form = ActivityForm()  # Create an empty form instance
    
    # If the request is a POST (i.e., submitting the form)
    if request.method == 'POST':
        form = ActivityForm(request.POST)
        if form.is_valid():
            # Save the new activity associated with the logged-in user
            activity = form.save(commit=False)
            activity.user = request.user  # Set the user to the logged-in user
            activity.save()

    return render(request, 'activitytracker/dashboard.html', {'activities': activities, 'form': form})


@login_required
def update_activity(request, pk):
    activity = get_object_or_404(Activity, pk=pk, user=request.user)
    
    if request.method == 'POST':
        form = ActivityForm(request.POST, instance=activity)
        if form.is_valid():
            # Save the changes if the form is valid
            updated_activity = form.save()

            # Check if any fields have changed (optional)
            if form.has_changed():
                changed_fields = form.changed_data
                change_description = "; ".join([f"{field} changed" for field in changed_fields])

                # Log the changes in a separate model if you prefer
                # Create a new ChangeHistory entry
                ChangeHistory.objects.create(
                    activity=updated_activity,
                    change_description=change_description
                )

            updated_activity.save()  # Save the updated activity
            return redirect('activity_list')  # Or wherever you want to redirect after saving
    else:
        form = ActivityForm(instance=activity)

    return render(request, 'activitytracker/update_activity.html', {'form': form})



@login_required
def delete_activity(request, pk):
    activity = get_object_or_404(Activity, pk=pk, user=request.user)
    if request.method == 'POST':
        activity.delete()
        return redirect('activity_list')  # Redirect after deletion

    return render(request, 'activitytracker/delete_activity.html', {'activity': activity})


def user_logout(request):
    logout(request)
    return redirect('home')


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class ActivityListCreateView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access this API

    def get(self, request):
        activities = request.user.activities.all()  # Filter activities by the current user
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Handle adding a new activity if needed
        serializer = ActivitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Assign to the logged-in user
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivityRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

 


