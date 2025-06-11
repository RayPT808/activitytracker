from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Activity
from datetime import timedelta

# ----------------------------------------
# User Serializer
# ----------------------------------------

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']

# ----------------------------------------
# Registration Serializer
# ----------------------------------------

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

# ----------------------------------------
# Activity Serializer
# ----------------------------------------
class ActivitySerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = '__all__'
        read_only_fields = ['user']

    def get_duration(self, obj):
        return int(obj.duration.total_seconds()) if obj.duration else 0

    def create(self, validated_data):
        """Convert duration from seconds to timedelta when creating."""
        seconds = validated_data.pop("duration", 0)
        validated_data["duration"] = timedelta(seconds=seconds)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Convert duration from seconds to timedelta when updating."""
        if "duration" in validated_data:
            seconds = validated_data.pop("duration")
            validated_data["duration"] = timedelta(seconds=seconds)
        return super().update(instance, validated_data)
