from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Activity
from datetime import timedelta

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    

class ActivitySerializer(serializers.ModelSerializer):
    # Completely override the default DurationField behavior
    duration = serializers.IntegerField()

    class Meta:
        model = Activity
        fields = "__all__"
        read_only_fields = ["user"]

    def to_representation(self, instance):
        """Convert model instance to JSON"""
        ret = super().to_representation(instance)
        ret['duration'] = int(instance.duration.total_seconds())  # force numeric output
        return ret

    def to_internal_value(self, data):
        """Convert input JSON to model instance"""
        data = super().to_internal_value(data)
        seconds = data.get("duration", 0)
        data["duration"] = timedelta(seconds=int(seconds))
        return data