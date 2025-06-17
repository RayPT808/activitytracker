from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from activitytracker.models import Activity


class ActivityCreationTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.force_authenticate(user=self.user)  # ✅ Authenticate client

    def test_create_activity(self):
        url = reverse("record_activity")
        data = {
            "activity_type": "running",
            "activity_name": "Morning Run",
            "duration_input": "00:30:00",
            "date": "2025-03-16",
            "notes": "Felt great!",
        }
        response = self.client.post(url, data, format="json")
        print("DEBUG RESPONSE DATA:", response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class InvalidActivityCreationTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser2", password="testpass2")
        self.client.force_authenticate(user=self.user)  # ✅ Authenticate client

    def test_invalid_activity_creation(self):
        url = reverse("record_activity")
        data = {
            "activity_type": "cycling",
            "activity_name": "No Duration",
            # Missing 'duration_input'
            "date": "2025-03-16",
            "notes": "Forgot duration",
        }
        response = self.client.post(url, data, format="json")
        print("DEBUG RESPONSE DATA:", response.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("duration_input", response.data["errors"])


class ActivityLogTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser3", password="testpass3")
        self.client.force_authenticate(user=self.user)  # ✅ Authenticate client

        # Create sample activity
        Activity.objects.create(
            user=self.user,
            activity_type="walking",
            activity_name="Evening Walk",
            duration=1800,
            date="2025-03-15",
            notes="Relaxing walk"
        )

    def test_activity_log(self):
        url = reverse("activity-list-create")
        response = self.client.get(url)
        print("DEBUG RESPONSE DATA:", response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

class ActivityUpdateTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser4", password="testpass4")
        self.client.force_login(self.user)  # Use force_login for Django form views

        self.activity = Activity.objects.create(
            user=self.user,
            activity_type="yoga",
            activity_name="Morning Yoga",
            duration=1800,
            date="2025-03-14",
            notes="Very relaxing"
        )

    def test_update_activity_notes(self):
        url = reverse("update_activity", kwargs={"pk": self.activity.pk})
        updated_data = {
            "activity_type": self.activity.activity_type,
            "activity_name": self.activity.activity_name,
            "duration_input": "00:30:00",  # ✅ Correct form field
            "date": "2025-03-14",
            "notes": "Updated: Felt energized!"
    }

        response = self.client.post(url, updated_data)
        print("DEBUG RESPONSE HTML:", response.content.decode())

        self.assertEqual(response.status_code, 302)

        self.activity.refresh_from_db()
        self.assertEqual(self.activity.notes, "Updated: Felt energized!")
