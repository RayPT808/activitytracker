from django.shortcuts import render
from django.http import HttpResponse




def my_activitytracker(request):
    return HttpResponse("Hello, Runner!")
