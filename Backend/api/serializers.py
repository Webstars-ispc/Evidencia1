from rest_framework import serializers
from .models import Rubro, Marca, Producto

class RubroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rubro
        fields = '__all__'

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'
