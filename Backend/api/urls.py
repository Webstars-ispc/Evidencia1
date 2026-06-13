from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RubroViewSet, MarcaViewSet, ProductoViewSet
from .views import cargar_excel

router = DefaultRouter()
router.register(r'rubros', RubroViewSet)
router.register(r'marcas', MarcaViewSet)
router.register(r'productos', ProductoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('cargar-excel/', cargar_excel, name='cargar_excel'),
]