from django.db import models
from django.contrib.auth.models import User

class Activity(models.Model):
    # Define activity options as a list of tuples
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
    duration = models.PositiveIntegerField(help_text="Duration in minutes")
    date = models.DateField()
    notes = models.TextField(blank=True, null=True, help_text="Optional notes about the activity")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name = "Activity"
        verbose_name_plural = "Activities"

    def __str__(self):
        return f"{self.user.username} - {self.activity_type} on {self.date}"



