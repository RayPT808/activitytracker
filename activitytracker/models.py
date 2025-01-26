from django.db import models
from django.contrib.auth.models import User

class Activity(models.Model):
    # Existing fields
    ACTIVITY_CHOICES = [
        ('walking', 'Walking'),
        ('hiking', 'Hiking'),
        ('running', 'Running'),
        ('cycling', 'Cycling'),
        ('swimming', 'Swimming'),
        ('strength_training', 'Strength Training'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_CHOICES)
    
    # Update the duration field to store the full duration as a string (hh:mm:ss)
    duration = models.CharField(max_length=8, help_text="Duration in hh:mm:ss format")
    
    date = models.DateField()
    notes = models.TextField(blank=True, null=True, help_text="Optional notes about the activity")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    excerpt = models.TextField(blank=True)
    activity_name = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name = "Activity"
        verbose_name_plural = "Activities"

    def __str__(self):
        return f"{self.user.username} - {self.activity_type} on {self.date}"
