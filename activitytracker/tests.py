from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token


class UserRegistrationTest(TestCase):
    def test_user_registration(self):
        url = reverse('api/register/', RegisterView.as_view(), name='user-registration')  # Update this to the actual registration URL
        data = {
            'username': 'testuser',
            'password': 'password123',
            'email': 'testuser@example.com',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())

class ActivityCreationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_create_activity(self):
        url = reverse('record/', views.record_activity, name='record_activity')  # Replace with your actual URL
        data = {
            'activity_type': 'running',
            'activity_name': 'Morning Run',
            'duration': '00:30:00',
            'date': '2025-03-16',
            'notes': 'Felt great!',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['activity_name'], 'Morning Run')


class ActivityLogTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_activity_log(self):
        url = reverse('list/', views.activity_list, name='activity-log')  # Replace with your actual URL
        response = self.client.get(url, format='json')

        try:
            response_data = response.json()  # Try to parse JSON
        except ValueError:
            self.fail(f"Expected JSON response, but got {response.content} instead")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response_data), 0)  # Ensure the activity log is not empty


class InvalidActivityCreationTest(TestCase):
    def setUp(self):
        # Create and log in a user with APIClient
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.client.login(username='testuser', password='password123')

    def test_invalid_activity_creation(self):
        url = reverse('activity-create')  # Update this to your actual URL
        data = {
            'activity_type': 'cycling',
            'activity_name': 'Morning Bike Ride',
            'duration': 'invalid-duration',  # Invalid duration format
            'date': '2025-03-16',
            'notes': 'Fun ride!',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('duration', response.data)  # Ensure the error is for duration
