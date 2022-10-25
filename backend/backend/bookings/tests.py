from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from backend.bookings.models import Booking

class BookingTests(APITestCase):
    def test_create_booking(self):
        """
        Ensure we can create a new booking object.
        """
        url = reverse('bookings:booking-list')
        data = {
            "buyer": "Juan Carlos",
            "provider" : "Pepe" ,
            "details": "Nothing",
            "date": "2022-10-29T01:09:17.981Z",
            "duration": 60
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 1)
        self.assertEqual(Booking.objects.get().buyer, 'Juan Carlos')
    
    def test_create_invalid_booking(self):
        """
        Ensure we can't create a new booking object with invalid params
        """
        url = reverse('bookings:booking-list')
        data = {
            "buyer": "Pedro",
            "provider": "Diego",
            "details": "Nothing",
            "date": "2022-10-14T01:09:17.981Z",
            "duration": 120
        }
        response = self.clien.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = {
            "buyer": "Manuel",
            "provider": "Manuel",
            "details": "Nothing",
            "date": "2022-10-14T01:09:17.981Z",
            "duration": 120
        }
        response = self.clien.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)