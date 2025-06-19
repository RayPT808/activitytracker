from datetime import date, time, timedelta

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


class ActivityForm(forms.ModelForm):
    # Display a time picker for the duration (hh:mm:ss)
    duration_input = forms.TimeField(
        label="Duration (hh:mm:ss)",
        widget=forms.TimeInput(
            format="%H:%M:%S", attrs={"type": "time", "class": "form-control"}
        ),
        help_text="Select duration (hh:mm:ss)",
        required=True,
    )

    class Meta:
        model = Activity
        fields = [
            "activity_type",
            "activity_name",
            "duration_input",
            "date",
            "notes"]
        widgets = {
            "activity_type": forms.Select(
                attrs={
                    "class": "form-control"}),
            "activity_name": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter activity name"}),
            "date": forms.DateInput(
                attrs={
                    "class": "form-control",
                    "type": "date"}),
            "notes": forms.Textarea(
                attrs={
                    "class": "form-control",
                    "placeholder": "Optional notes"}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["date"].widget.attrs["max"] = date.today().isoformat()
        # If editing, set the initial duration value
        if self.instance and self.instance.pk and self.instance.duration:
            total_seconds = self.instance.duration
            hours = total_seconds // 3600
            minutes = (total_seconds % 3600) // 60
            seconds = total_seconds % 60
            self.fields["duration_input"].initial = time(
                hour=hours, minute=minutes, second=seconds
            )

    def clean_date(self):
        date_val = self.cleaned_data["date"]
        if date_val > timezone.now().date():
            raise forms.ValidationError(
                "The activity date cannot be in the future.")
        return date_val

    def clean(self):
        cleaned_data = super().clean()
        duration_time = cleaned_data.get("duration_input")
        if duration_time:
            total_seconds = (
                duration_time.hour * 3600
                + duration_time.minute * 60
                + duration_time.second
            )
            cleaned_data["duration"] = total_seconds  # Set the model field
        else:
            raise forms.ValidationError("Duration is required.")
        return cleaned_data

    def save(self, commit=True):
        instance = super().save(commit=False)
        # Save the converted duration in seconds to the model
        instance.duration = self.cleaned_data["duration"]
        if commit:
            instance.save()
        return instance
