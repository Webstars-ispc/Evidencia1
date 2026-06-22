from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RubroViewSet, MarcaViewSet, ProductoViewSet, cargar_excel, aumento_general, aumento_por_rubro, aumento_por_marca, aumento_individual


router = DefaultRouter()
router.register(r'rubros', RubroViewSet)
router.register(r'marcas', MarcaViewSet)
router.register(r'productos', ProductoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('cargar-excel/', cargar_excel, name='cargar_excel'),
    path('aumentos/general/', aumento_general, name='aumento_general'),
    path('aumentos/rubro/', aumento_por_rubro, name='aumento_rubro'),
    path('aumentos/marca/', aumento_por_marca, name='aumento_marca'),
    path('aumentos/individual/', aumento_individual, name='aumento_individual'),
]