from django.urls import path
from . import views
urlpatterns = [
    path('room/',views.RoomView.as_view(), name= 'room' ),
    path('create-room/',views.CreateRoomView.as_view(), name= 'room' ),
    path('get-room/',views.GetRoom.as_view(), name= 'getRoom' ),
    path('join-room/',views.RoomJoin.as_view(), name= 'RoomJoin' ),
    path('user-in-room/',views.UserInRoom.as_view()),
    path('leave-room/',views.LeaveRoom.as_view()),
    path('update-room/',views.UpdateRoomView.as_view()),
   
]