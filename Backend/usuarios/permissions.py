from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    """Solo deja pasar a usuarios que pertenecen al grupo 'Administrador'"""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.groups.filter(name='Administrador').exists()
        )