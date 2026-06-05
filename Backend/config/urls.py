from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import ProductoViewSet, RubroViewSet, MarcaViewSet

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'rubros', RubroViewSet)
router.register(r'marcas', MarcaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/auth/', include('usuarios.urls')),
]
