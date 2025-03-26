from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.timezone import now
from .models import Activity
from datetime import timedelta
from datetime import datetime


class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True, widget=forms.EmailInput(attrs={'class': 'form-control'}))

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control'}),
            'password1': forms.PasswordInput(attrs={'class': 'form-control'}),
            'password2': forms.PasswordInput(attrs={'class': 'form-control'}),
        }

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')

        if password1 and password2 and password1 != password2:
            raise ValidationError("The two password fields must match.")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user
    

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name'] 



class DurationInput(forms.TextInput):
    input_type = 'text'

    def __init__(self, attrs=None):
        default_attrs = {'class': 'form-control'}
        if attrs:
            default_attrs.update(attrs)
        super().__init__(attrs=default_attrs)

    def format_value(self, value):
        if value:
            return str(value)  # Assuming value is already in 'hh:mm:ss' format
        return ''

class ActivityForm(forms.ModelForm):
    class Meta:
        model = Activity
        fields = ['activity_type', 'activity_name', 'duration', 'date', 'notes', 'file']  # Added 'file'
        widgets = {
            'activity_type': forms.Select(attrs={'class': 'form-control'}),
            'activity_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter activity name'}),
            'duration': DurationInput(attrs={'class': 'form-control', 'placeholder': 'hh:mm:ss'}),
            'date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'notes': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Optional notes'}),
            'file': forms.FileInput(attrs={'class': 'form-control'}),  # File input
        }

    def clean_duration(self):
        duration = self.cleaned_data.get('duration')

        # Convert timedelta to hh:mm:ss format
        if isinstance(duration, timedelta):
            total_seconds = int(duration.total_seconds())
            hours, remainder = divmod(total_seconds, 3600)
            minutes, seconds = divmod(remainder, 60)
            duration = f"{hours:02}:{minutes:02}:{seconds:02}"

        # Ensure duration follows 'hh:mm:ss' format
        parts = duration.split(':')
        if len(parts) != 3:
            raise forms.ValidationError("Duration must be in the format hh:mm:ss.")

        hours, minutes, seconds = parts
        if not (hours.isdigit() and minutes.isdigit() and seconds.isdigit()):
            raise forms.ValidationError("Duration must only contain numbers.")

        return duration

    def clean_date(self):
        date = self.cleaned_data['date']

        # Ensure date is not in the future
        if date > timezone.now().date():
            raise forms.ValidationError("The activity date cannot be in the future.")
        return date
def clean_file(self):
    uploaded_file = self.cleaned_data.get('file')
    if uploaded_file:
        # Validate file extension
        valid_extensions = ['.gpx', '.fit']
        if not any(uploaded_file.name.endswith(ext) for ext in valid_extensions):
            raise ValidationError('Unsupported file format. Please upload a .gpx or .fit file.')

        # Parse the file depending on its type
        if uploaded_file.name.endswith('.gpx'):
            parsed_data = parse_gpx_file(uploaded_file)
        elif uploaded_file.name.endswith('.fit'):
            parsed_data = parse_fit_file(uploaded_file)

        # Optionally, populate form fields based on parsed data
        self.cleaned_data['duration'] = parsed_data['duration']
        self.cleaned_data['activity_type'] = parsed_data['activity_type']
        self.cleaned_data['date'] = parsed_data['date']
        
    return uploaded_file


def parse_gpx_file(uploaded_file):
    # Read the uploaded .gpx file content
    gpx = gpxpy.parse(uploaded_file.read())

    # Example: Extracting the first track (assuming it's the relevant activity)
    track = gpx.tracks[0]
    segment = track.segments[0]

    # Extracting data like duration and start time
    activity_duration = segment.get_duration()  # in seconds
    start_time = segment.points[0].time  # The start time of the activity

    # Assuming the activity type is determined from the file name or another field
    # You can parse this data as needed
    return {
        'duration': str(activity_duration),
        'start_time': start_time,
        'activity_type': 'walking',  # Example, can be improved with better logic
        'date': start_time.date()
    }

def parse_fit_file(uploaded_file):
    fitfile = fitparse.FitFile(uploaded_file)

    activity_duration = 0
    start_time = None
    activity_type = 'unknown'  # Default type

    for record in fitfile.get_messages('record'):
        record_data = {d.name: d.value for d in record}
        if 'timestamp' in record_data and start_time is None:
            start_time = record_data['timestamp']
        if 'total_timer_time' in record_data:
            activity_duration = record_data['total_timer_time']
    
    # Set default values if data is missing
    if not start_time:
        start_time = timezone.now()

    return {
        'duration': str(timedelta(seconds=int(activity_duration))),
        'start_time': start_time,
        'activity_type': activity_type,  # You could improve this by analyzing more fields
        'date': start_time.date()
    }