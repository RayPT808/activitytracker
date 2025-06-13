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

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'
        read_only_fields = ['user']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.duration:
            total_seconds = int(instance.duration.total_seconds())
            hours = total_seconds // 3600
            minutes = (total_seconds % 3600) // 60
            seconds = total_seconds % 60
            rep['duration'] = f"{hours:02}:{minutes:02}:{seconds:02}"
        else:
            rep['duration'] = "00:00:00"
        return rep

    def validate_duration(self, value):
        # This can be expanded to validate format
        return value

    def create(self, validated_data):
        duration_str = self.initial_data.get('duration', '00:00:00')
        validated_data['duration'] = self.parse_duration_string(duration_str)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        duration_str = self.initial_data.get('duration', '00:00:00')
        validated_data['duration'] = self.parse_duration_string(duration_str)
        return super().update(instance, validated_data)

    def parse_duration_string(self, duration_str):
        try:
            parts = [int(p) for p in duration_str.split(":")]
            if len(parts) == 3:
                hours, minutes, seconds = parts
                return timedelta(hours=hours, minutes=minutes, seconds=seconds)
        except Exception:
            pass
        return timedelta(seconds=0)
