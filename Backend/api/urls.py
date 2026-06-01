from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RubroViewSet, MarcaViewSet, ProductoViewSet, UsuarioViewSet

router = DefaultRouter()
router.register(r'rubros', RubroViewSet)
router.register(r'marcas', MarcaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'usuarios', UsuarioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]