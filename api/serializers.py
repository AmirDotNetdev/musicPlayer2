from rest_framework import serializers
from .models import Room
class RoomSerializers(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id' , 'code', 'host','guest_can_pause', 'votes_to_skip', 'created_at')

class CreateRoomSerializers(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip')


class UpdateRoomSerializers(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip', 'code')