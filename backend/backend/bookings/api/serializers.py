from time import time
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.utils import timezone
from ..models import Booking



class BookingSerializer(ModelSerializer):

    class Meta:
        model = Booking
        fields = '__all__'

    def validate(self, data):
        reserved_start_datetime = timezone.datetime.date(data['date'])
        current_datetime = timezone.datetime.now().date()
        if reserved_start_datetime < current_datetime:
            raise serializers.ValidationError({"date": "You can't book on a past date"})

        if data['buyer'] == data['provider']:
            raise serializers.ValidationError("You can't book yourself")

        return data