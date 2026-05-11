from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.test import APIClient

from .models import (
    Profile,
    ParkingLot,
    Zone,
    Slot,
    Vehicle,
    Reservation,
    Session,
    Payment
)


class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_signup_and_login(self):
        # Signup
        res = self.client.post("/api/auth/signup/", {
            "email": "admin@gmail.com",
            "password": "Admin123",
            "name": "Admin",
            "role": "admin"
        }, format="json")

        self.assertEqual(res.status_code, 200)
        self.assertIn("access", res.data)

        # Login
        res = self.client.post("/api/auth/login/", {
            "email": "admin@gmail.com",
            "password": "Admin123"
        }, format="json")

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["role"], "admin")


class ParkingFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create user
        self.user = User.objects.create_user(
            username="user@gmail.com",
            email="user@gmail.com",
            password="User123"
        )
        Profile.objects.create(user=self.user)

        # Auth
        login = self.client.post("/api/auth/login/", {
            "email": "user@gmail.com",
            "password": "User123"
        }, format="json")

        self.client.credentials(
            HTTP_AUTHORIZATION="Bearer " + login.data["access"]
        )

        # Parking structure
        self.lot = ParkingLot.objects.create(
            name="Main Parking",
            address="City Center",
            operator=self.user,
            latitude=10,
            longitude=10
        )

        self.zone = Zone.objects.create(lot=self.lot, label="A")

        self.slot = Slot.objects.create(
            zone=self.zone,
            code="A1"
        )

        self.vehicle = Vehicle.objects.create(
            user=self.user,
            plate="UP32AB1234"
        )

    def test_full_parking_flow(self):
        # Reserve
        res = self.client.post("/api/reserve/", {
            "slot": self.slot.id,
            "vehicle": self.vehicle.id
        }, format="json")

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["status"], "BOOKED")

        # Entry
        res = self.client.post("/api/entry/", {
            "vehicle": self.vehicle.id
        }, format="json")

        self.assertEqual(res.status_code, 200)

        session_id = res.data["id"]

        # Exit
        res = self.client.post("/api/exit/", {
            "session": session_id
        }, format="json")

        self.assertEqual(res.status_code, 200)
        self.assertGreater(float(res.data["charges"]), 0)

        # Payment
        res = self.client.post("/api/pay/", {
            "session": session_id,
            "method": "CASH"
        }, format="json")

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["status"], "PAID")
