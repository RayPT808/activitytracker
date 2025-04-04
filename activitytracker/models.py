from cloudinary_storage.storage import MediaCloudinaryStorage
from django.contrib.auth.models import User
from django.db import models


class Activity(models.Model):

    ACTIVITY_CHOICES = [
        ("walking", "Walking"),
        ("hiking", "Hiking"),
        ("running", "Running"),
        ("cycling", "Cycling"),
        ("swimming", "Swimming"),
        ("strength_training", "Strength Training"),
        ("yoga", "Yoga"),
        ("crossfit", "CrossFit"),
        ('dancing', 'Dancing'),
        ('gym', 'Gym'), 
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activities")
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_CHOICES)
    duration = models.DurationField(help_text="Duration of activity in hh:mm:ss format")
    date = models.DateField()
    notes = models.TextField(
        blank=True, null=True, help_text="Optional notes about the activity"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    excerpt = models.TextField(blank=True)
    
    activity_name = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        ordering = ["-date", "-created_at"]
        verbose_name = "Activity"
        verbose_name_plural = "Activities"

    def __str__(self):
        return f"{self.user.username} - {self.activity_type} on {self.date}"


class ActivityLog(models.Model):
    activity = models.ForeignKey(
        Activity, on_delete=models.CASCADE, related_name="logs"
    )
    change_description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Log for {self.activity} at {self.timestamp}"


class ChangeHistory(models.Model):
    activity = models.ForeignKey(
        Activity, on_delete=models.CASCADE, related_name="change_history"
    )
    change_description = models.TextField()
    changed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Change Log for {self.activity.activity_name} on {self.changed_at}"
