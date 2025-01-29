from django.shortcuts import get_object_or_404
from .models import Activity
from django.shortcuts import render, redirect
from django.http import HttpResponse
from .forms import ActivityForm
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from datetime import timedelta
from rest_framework import generics
from rest_framework import viewsets
from .serializers import ActivitySerializer
from django.contrib.auth import logout
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status





def home(request):
    return render(request, 'activitytracker/base.html')


def about(request):
    return render(request, 'activitytracker/about.html')


@csrf_protect
def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard')  # Redirect to the dashboard after successful registration
    else:
        form = UserCreationForm()
    
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
    return render(request, 'activitytracker/profile.html', {'user': request.user})



@login_required
def record_activity(request):
    if request.method == 'POST':
        form = ActivityForm(request.POST)
        if form.is_valid():
            activity = form.save(commit=False)
            activity.user = request.user  # Assign the logged-in user
            hours = int(request.POST.get('hours', 0))
            minutes = int(request.POST.get('minutes', 0))
            seconds = int(request.POST.get('seconds', 0))


            activity.duration = timedelta(hours=hours, minutes=minutes, seconds=seconds)

            activity.save()
            return redirect('dashboard')  
    else:
        form = ActivityForm()

    return render(request, 'tracker/record_activity.html', {'form': form})

@login_required
def activity_list(request):
    activities = request.user.activities.all()  # Use related_name 'activities' to get user's activities
    return render(request, 'activitytracker/activity_list.html', {'activities': activities})
    

@login_required
def update_activity(request, pk):
    activity = get_object_or_404(Activity, pk=pk, user=request.user)  # Ensure only the owner can edit
    if request.method == 'POST':
        form = ActivityForm(request.POST, instance=activity)
        if form.is_valid():
            form.save()
            return redirect('activity_list')  # Redirect to the activity list page after updating
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


class ActivityListCreateView(generics.ListCreateAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class ActivityRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

 


