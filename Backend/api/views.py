from rest_framework import viewsets
from .models import Rubro, Marca, Producto
from .serializers import RubroSerializer, MarcaSerializer, ProductoSerializer

class RubroViewSet(viewsets.ModelViewSet):
    queryset = Rubro.objects.all()
    serializer_class = RubroSerializer

class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
