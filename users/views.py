from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.serializers import ValidationError
from rest_framework.permissions import AllowAny
from django.contrib.auth import password_validation

# Serializer for user registration
from rest_framework import serializers

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


@api_view(['POST'])
@permission_classes([AllowAny])  # Allow any user to register
def register(request):
    if request.method == 'POST':
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'detail': 'User created successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
