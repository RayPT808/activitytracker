from django.shortcuts import get_object_or_404
from .models import Activity
from django.shortcuts import render, redirect
from django.http import HttpResponse
from .forms import ActivityForm
from django.contrib.auth.decorators import login_required



def home(request):
    return render(request, 'activitytracker/base.html')


def about(request):
    return render(request, 'activitytracker/about.html')



def register(request):
    return render(request, 'activitytracker/register.html')


def my_activitytracker(request):
    return HttpResponse("Hello, Runner!")

@login_required
def record_activity(request):
    if request.method == 'POST':
        form = ActivityForm(request.POST)
        if form.is_valid():
            activity = form.save(commit=False)
            activity.user = request.user  # Assign the logged-in user
            activity.save()
            return redirect('activity_list')  # Redirect to a list of activities
    else:
        form = ActivityForm()

    return render(request, 'tracker/record_activity.html', {'form': form})

@login_required
def activity_list(request):
    activities = request.user.activities.all()  # Use related_name 'activities' to get user's activities
    return render(request, 'tracker/activity_list.html', {'activities': activities})
    

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

    return render(request, 'tracker/update_activity.html', {'form': form})  


