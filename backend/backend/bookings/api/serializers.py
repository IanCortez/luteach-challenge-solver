from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.utils import timezone
from ..models import Booking



class BookingSerializer(ModelSerializer):

    class Meta:
        model = Booking
        fields = '__all__'

    def validate(self, data):
        reserved_start_date = timezone.datetime.date(data['date'])
        current_date = timezone.datetime.now().date()

        reserved_start_time = timezone.datetime.time(data['date'])
        current_time = timezone.now().time()

        if reserved_start_date <= current_date and reserved_start_time < current_time:
            raise serializers.ValidationError({"date": "You can't book on a past date"})

        if data['buyer'] == data['provider']:
            raise serializers.ValidationError("You can't book yourself")

        return data