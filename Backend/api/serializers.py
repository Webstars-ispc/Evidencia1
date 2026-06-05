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
    marca_nombre = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
    )

    class Meta:
        model = Producto
        fields = '__all__'

    def _resolve_marca(self, validated_data):
        nombre = validated_data.pop('marca_nombre', None)
        if nombre is not None:
            nombre = nombre.strip()
            if nombre:
                marca, _ = Marca.objects.get_or_create(nombre=nombre)
                validated_data['marca'] = marca
            else:
                validated_data['marca'] = None
        return validated_data

    def create(self, validated_data):
        validated_data = self._resolve_marca(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data = self._resolve_marca(validated_data)
        return super().update(instance, validated_data)
