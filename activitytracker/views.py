from django.shortcuts import render, redirect
from django.http import HttpResponse
from .forms import ActivityForm



def my_activitytracker(request):
    return HttpResponse("Hello, Runner!")


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

def activity_list(request):
    activities = request.user.activity_set.all()  # Assuming a foreign key to User
    return render(request, 'tracker/activity_list.html', {'activities': activities})


