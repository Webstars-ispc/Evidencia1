from rest_framework import serializers
from .models import Rubro, Marca, Producto
from unidecode import unidecode

def estandarizar(texto):
    if not texto:
        return texto
    return unidecode(str(texto).strip().upper())


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
            nombre = estandarizar(nombre)
            if nombre:
                marca, _ = Marca.objects.get_or_create(nombre=nombre)
                validated_data['marca'] = marca
            else:
                validated_data['marca'] = None
        return validated_data

    def create(self, validated_data):
        validated_data['nombre'] = estandarizar(validated_data.get('nombre', ''))
        if validated_data.get('descripcion'):
            validated_data['descripcion'] = estandarizar(validated_data['descripcion'])
        validated_data = self._resolve_marca(validated_data)

        # Si tiene código de barras, usar update_or_create para evitar duplicados
        codigo_barras = validated_data.get('codigo_barras', '')
        if codigo_barras:
            producto, creado = Producto.objects.update_or_create(
                codigo_barras=codigo_barras,
                defaults=validated_data
            )
            return producto

        # Si no tiene código de barras, verificar por nombre + rubro
        nombre = validated_data.get('nombre', '')
        rubro = validated_data.get('rubro', None)
        if rubro:
            producto, creado = Producto.objects.update_or_create(
                nombre=nombre,
                rubro=rubro,
                defaults=validated_data
            )
            return producto

        # Si no tiene ni código ni rubro, crear normalmente
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['nombre'] = estandarizar(validated_data.get('nombre', ''))
        if validated_data.get('descripcion'):
            validated_data['descripcion'] = estandarizar(validated_data['descripcion'])
        validated_data = self._resolve_marca(validated_data)
        return super().update(instance, validated_data)