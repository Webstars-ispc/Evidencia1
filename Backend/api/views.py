from rest_framework import viewsets, status
from rest_framework.response import Response
from django.http import Http404
from .models import Rubro, Marca, Producto, Usuario
from .serializers import RubroSerializer, MarcaSerializer, ProductoSerializer, UsuarioSerializer

class CustomModelViewSet(viewsets.ModelViewSet):
    """
    Clase base personalizada para evidenciar el manejo manual 
    de los códigos de estado HTTP (200, 201, 204, 400 y 404).
    """
    
    # GET (Listar todos) -> 200 OK
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # GET (Obtener un registro por ID) -> 200 OK o 404 NOT FOUND
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Http404:
            return Response({'error': 'Recurso no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    # POST (Crear nuevo registro) -> 201 CREATED o 400 BAD REQUEST
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PUT / PATCH (Actualizar registro) -> 200 OK, 400 BAD REQUEST o 404 NOT FOUND
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except Http404:
            return Response({'error': 'Recurso no encontrado'}, status=status.HTTP_404_NOT_FOUND)
            
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE (Eliminar registro) -> 204 NO CONTENT o 404 NOT FOUND
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Http404:
            return Response({'error': 'Recurso no encontrado'}, status=status.HTTP_404_NOT_FOUND)


class RubroViewSet(CustomModelViewSet):
    queryset = Rubro.objects.all()
    serializer_class = RubroSerializer

class MarcaViewSet(CustomModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer

class ProductoViewSet(CustomModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class UsuarioViewSet(CustomModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer