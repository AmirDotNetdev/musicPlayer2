from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics, status
from . models import *
from .serializers import RoomSerializers, CreateRoomSerializers,UpdateRoomSerializers
from rest_framework.views import APIView
from rest_framework.response import Response
class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializers


class RoomJoin(APIView):
    lookup_url_kwargs = 'code'
    def post(self, request, format=None):
        code = self.request.data.get(self.lookup_url_kwargs)
        if code!= None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                self.request.session['room_code'] = code
                return Response({'message':'room joined!'}, status=status.HTTP_200_OK)
            return Response({'Bad Request':'room code is invalid'},status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request':'invalid post data, enter data correct'},status=status.HTTP_400_BAD_REQUEST)



class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializers

    def post(self, request, format = None):
        if not self.request.session.session_key:
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host = host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.vote_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room.code
            else:
                room = Room(host=host, votes_to_skip=votes_to_skip, guest_can_pause=guest_can_pause)
                room.save()
                self.request.session['room_code'] = room.code
            return Response(RoomSerializers(room).data, status= status.HTTP_200_OK)


class GetRoom(APIView):
    serializers_class = RoomSerializers
    lookup_url_kwargs = 'code'
    def get(self, request, format = None):
        code = self.request.GET.get(self.lookup_url_kwargs)
        if(code != None):
            room = Room.objects.filter(code = code)
            if(len(room)>0):
                data = RoomSerializers(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'code is incorrect'}, status= status.HTTP_404_NOT_FOUND)
        return Response({'url parameters': 'url parameters not found'}, status= status.HTTP_404_NOT_FOUND)


class UserInRoom(APIView):
    def get(self, request, format= None):
        if not self.request.session.session_key:
            self.request.session.create()
        data = {
            'code' : self.request.session.get('room_code'),
        }
        return JsonResponse(data, status = status.HTTP_200_OK)
    

class LeaveRoom(APIView):
    def post(self, request,format=None):
        self.request.session.pop("room_code")
        host_id = self.request.session.session_key
        room_result = Room.objects.filter(host = host_id)
        if len(room_result) > 0 :
            room = room_result[0]
            room.delete()
        return Response({"Message":"Success"}, status= status.HTTP_200_OK)


class UpdateRoomView(APIView):
    serializer_class = UpdateRoomSerializers
    def patch(self, request,format = None):
        if not self.request.session.session_key:
            self.request.session.create()
        
        serializers = self.serializer_class(data= self.request.data)
        if  serializers.is_valid():
            
            votes_to_skip = serializers.data.get('votes_to_skip')
            guest_can_pause = serializers.data.get('guest_can_pause')
            code = serializers.data.get('code')

            queryset = Room.objects.filter(code= code)
            if not queryset.exists():
                return Response({"Message":'room code is not valid'}, status=status.HTTP_404_NOT_FOUND)
            user_id = self.request.session.session_key
            

            room = queryset[0]
            if room.host != user_id:
                return Response({'Message':'Your not valid to update room'}, status=status.HTTP_403_FORBIDDEN)
            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip               
            room.save(update_fields=['guest_can_pause','votes_to_skip'])
            return Response({'Message':'Success ful updated'}, status=status.HTTP_200_OK)
        return Response({'Message':'invalid data'}, status=status.HTTP_400_BAD_REQUEST)
        