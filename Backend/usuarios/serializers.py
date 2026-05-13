from rest_framework import serializers
from django.contrib.auth.models import User, Group

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(
        choices=['Administrador', 'Empleado'],
        write_only=True,
        required=False
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')

    def create(self, validated_data):
        role = validated_data.pop('role', 'Empleado')
        user = User.objects.create_user(**validated_data)
        group = Group.objects.get(name=role)
        user.groups.add(group)
        return user