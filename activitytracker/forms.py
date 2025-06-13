from datetime import timedelta
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone
from .models import Activity


class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(
        required=True, widget=forms.EmailInput(attrs={"class": "form-control"})
    )

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2")
        widgets = {
            "username": forms.TextInput(attrs={"class": "form-control"}),
            "password1": forms.PasswordInput(attrs={"class": "form-control"}),
            "password2": forms.PasswordInput(attrs={"class": "form-control"}),
        }

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")

        if password1 and password2 and password1 != password2:
            raise ValidationError("The two password fields must match.")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ["first_name", "last_name"]


class DurationInput(forms.TextInput):
    input_type = "text"

    def __init__(self, attrs=None):
        default_attrs = {"class": "form-control"}
        if attrs:
            default_attrs.update(attrs)
        super().__init__(attrs=default_attrs)

    def format_value(self, value):
        if value:
            return str(value)
        return ""


class ActivityForm(forms.ModelForm):
    class Meta:
        model = Activity
        fields = ["activity_type", "activity_name", "duration", "date", "notes"]
        widgets = {
            "activity_type": forms.Select(attrs={"class": "form-control"}),
            "activity_name": forms.TextInput(attrs={"class": "form-control", "placeholder": "Enter activity name"}),
            "duration": DurationInput(attrs={"class": "form-control", "placeholder": "hh:mm:ss"}),
            "date": forms.DateInput(attrs={"class": "form-control", "type": "date"}),
            "notes": forms.Textarea(attrs={"class": "form-control", "placeholder": "Optional notes"}),
        }

    def clean_duration(self):
        duration = self.cleaned_data.get("duration")

        # If it's already a timedelta (e.g. during edit), return as-is
        if isinstance(duration, timedelta):
            return duration

        if isinstance(duration, str):
            parts = duration.split(":")
            if len(parts) != 3:
                raise forms.ValidationError("Duration must be in the format hh:mm:ss.")

            hours, minutes, seconds = parts
            if not (hours.isdigit() and minutes.isdigit() and seconds.isdigit()):
                raise forms.ValidationError("Duration must only contain numbers.")

            return timedelta(
                hours=int(hours),
                minutes=int(minutes),
                seconds=int(seconds)
            )

        raise forms.ValidationError("Invalid duration format.")
    def clean_date(self):
        date = self.cleaned_data["date"]
        if date > timezone.now().date():
            raise forms.ValidationError("The activity date cannot be in the future.")
        return date
