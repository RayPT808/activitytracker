from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from activitytracker import views
from activitytracker.views import RegisterView


class UserRegistrationTest(TestCase):
    def test_user_registration(self):
        url = reverse("user_registration")
        data = {
            "username": "testuser",
            "password": "password123",
            "email": "testuser@example.com",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="testuser").exists())


class ActivityCreationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )

        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.token)

    def test_create_activity(self):
        url = reverse("record_activity")
        data = {
            "activity_type": "running",
            "activity_name": "Morning Run",
            "duration": "00:30:00",
            "date": "2025-03-16",
            "notes": "Felt great!",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ActivityLogTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )

        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.token)

        self.activity_data = {
            "activity_type": "running",
            "activity_name": "Test Run",
            "duration": "00:30:00",
            "date": "2025-03-16",
            "notes": "Felt great!",
        }
        self.client.post(reverse("record_activity"), self.activity_data, format="json")

    def test_activity_log(self):
        url = reverse("activity-log")
        response = self.client.get(url, format="json")

        try:
            response_data = response.json()
        except ValueError:
            self.fail(f"Expected JSON response, but got {response.content} instead")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response_data), 0)


class InvalidActivityCreationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )

        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.token)

    def test_invalid_activity_creation(self):
        url = reverse("activity-create")
        data = {
            "activity_type": "cycling",
            "activity_name": "Morning Bike Ride",
            "duration": "invalid-duration",
            "date": "2025-03-16",
            "notes": "Fun ride!",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("duration", response.data)
