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

    def create(self, validated_data):
        seconds = validated_data.pop("duration")
        validated_data["duration"] = timedelta(seconds=seconds)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "duration" in validated_data:
            seconds = validated_data.pop("duration")
            validated_data["duration"] = timedelta(seconds=seconds)
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['duration'] = int(instance.duration.total_seconds())
        return ret