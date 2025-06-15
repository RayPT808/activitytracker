from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Activity

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
# Activity Serializer (Final, correct version for integer duration)

class ActivitySerializer(serializers.ModelSerializer):
    # Optional: include a read-only formatted duration for display purposes
    duration_formatted = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Activity
        fields = '__all__'
        read_only_fields = ['user']

    def get_duration_formatted(self, obj):
        total_seconds = int(obj.duration or 0)
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60
        return f"{hours:02}:{minutes:02}:{seconds:02}"

    # No custom create(), update(), or to_representation() needed!
