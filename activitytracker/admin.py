from django.contrib import admin

from .models import Activity


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("user", "activity_type", "duration", "date", "created_at")
    list_filter = ("activity_type", "date")
    search_fields = ("user__username", "activity_type", "notes")
