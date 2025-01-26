from django import forms
from .models import Activity

class DurationInput(forms.TextInput):
    input_type = 'time'

class ActivityForm(forms.ModelForm):
    class Meta:
        model = Activity
        fields = ['activity_type', 'activity_name', 'duration', 'date', 'notes']
        widgets = {
            'activity_type': forms.Select(attrs={'class': 'form-control'}),
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