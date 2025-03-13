from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.utils import timezone
from .models import Activity

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
    input_type = 'time'

from django import forms
from django.core.exceptions import ValidationError
from django.utils import timezone
from .models import Activity  # Assuming Activity is your model

class ActivityForm(forms.ModelForm):
    class Meta:
        model = Activity
        fields = ['activity_type', 'activity_name', 'duration', 'date', 'notes']
        widgets = {
            'activity_type': forms.Select(attrs={'class': 'form-control'}),
            'activity_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter activity name'}),
            'duration': DurationInput(attrs={'class': 'form-control', 'step': 1}),  # Custom widget for hh:mm:ss format
            'date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'notes': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Optional notes'}),
        }

    def clean_duration(self):
        duration = self.cleaned_data.get('duration')
        # Ensure the duration follows the 'hh:mm:ss' format (e.g., '01:30:45')
        parts = duration.split(':')
        if len(parts) != 3:
            raise forms.ValidationError("Duration must be in the format hh:mm:ss.")
        hours, minutes, seconds = parts
        if not (hours.isdigit() and minutes.isdigit() and seconds.isdigit()):
            raise forms.ValidationError("Duration must only contain numbers.")
        return duration

    def clean_date(self):
        date = self.cleaned_data['date']
        
        # Check if the date is in the future
        if date > timezone.now().date():
            raise ValidationError("The activity date cannot be in the future.")
        
        return date
