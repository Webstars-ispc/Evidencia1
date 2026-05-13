from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

class RegisterView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class LoginView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)

class RefreshView(TokenRefreshView):
    permission_classes = (permissions.AllowAny,)