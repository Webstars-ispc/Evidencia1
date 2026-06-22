from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import Http404
from .models import Rubro, Marca, Producto
from .serializers import RubroSerializer, MarcaSerializer, ProductoSerializer, estandarizar
from decimal import Decimal, ROUND_HALF_UP

import openpyxl
from unidecode import unidecode

class CustomModelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Http404:
            return Response({'error': 'Recurso no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cargar_excel(request):
    archivo = request.FILES.get('archivo')
    if not archivo:
        return Response({'error': 'No se envió ningún archivo.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        wb = openpyxl.load_workbook(archivo)
        hoja = wb['PRODUCTOS']
    except KeyError:
        return Response(
            {'error': 'El archivo no contiene una hoja llamada "PRODUCTOS". Por favor, renombrá la hoja principal como "PRODUCTOS".'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception:
        return Response(
            {'error': 'No se pudo leer el archivo. Verificá que sea un .xlsx válido.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Obtener o crear el rubro por defecto para productos sin rubro
    rubro_default, _ = Rubro.objects.get_or_create(nombre='SIN RUBRO')

    creados = 0
    actualizados = 0
    errores = []

    filas = list(hoja.iter_rows(min_row=1, values_only=True))
    if len(filas) < 2:
        return Response({'error': 'La hoja PRODUCTOS debe tener al menos una fila de encabezados y una de datos.'}, status=status.HTTP_400_BAD_REQUEST)

    # --- Leer encabezados (primera fila) ---
    encabezados = filas[0]
    columnas = {}
    for idx, nombre_col in enumerate(encabezados):
        if nombre_col:
            columnas[estandarizar(str(nombre_col))] = idx

    nombre_idx = columnas.get('PRODUCTO')
    rubro_idx = columnas.get('RUBRO')
    marca_idx = columnas.get('MARCA')
    codigo_idx = columnas.get('CODIGO')
    costo_idx = columnas.get('PRECIO COMPRA')
    venta_idx = columnas.get('PRECIO VENTA')
    stock_idx = columnas.get('STOCK')

    if nombre_idx is None:
        return Response(
            {'error': 'No se encontró la columna "PRODUCTO". La hoja debe tener: PRODUCTO, RUBRO, MARCA, CODIGO, PRECIO COMPRA, PRECIO VENTA.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # --- Procesar filas de datos (desde la fila 2) ---
    for i, fila in enumerate(filas[1:], start=2):
        if not fila or all(c is None for c in fila):
            continue

        # Nombre del producto (obligatorio)
        nombre = estandarizar(str(fila[nombre_idx])) if fila[nombre_idx] else ''
        if not nombre:
            continue

        # Rubro
        rubro = rubro_default  # por defecto si no hay rubro en el Excel
        if rubro_idx is not None and fila[rubro_idx]:
            rubro_nombre = estandarizar(str(fila[rubro_idx]))
            if rubro_nombre:
                rubro, _ = Rubro.objects.get_or_create(nombre=rubro_nombre)

        # Marca
        marca = None
        if marca_idx is not None and fila[marca_idx]:
            marca_nombre = estandarizar(str(fila[marca_idx]))
            if marca_nombre:
                marca, _ = Marca.objects.get_or_create(nombre=marca_nombre)

        # Código de barras
        codigo_barras = str(fila[codigo_idx]).strip() if codigo_idx is not None and fila[codigo_idx] else ''

        # Precios
        try:
            precio_costo = float(fila[costo_idx]) if costo_idx is not None and fila[costo_idx] is not None else 0.0
        except (ValueError, TypeError):
            precio_costo = 0.0

        try:
            precio_venta = float(fila[venta_idx]) if venta_idx is not None and fila[venta_idx] is not None else 0.0
        except (ValueError, TypeError):
            precio_venta = 0.0

        # Stock
        try:
            stock = int(float(fila[stock_idx])) if stock_idx is not None and fila[stock_idx] is not None else 0
        except (ValueError, TypeError):
            stock = 0

        # --- Guardar producto ---
        try:
            if codigo_barras:
                prod, creado = Producto.objects.update_or_create(
                    codigo_barras=codigo_barras,
                    defaults={
                        'nombre': nombre,
                        'rubro': rubro,
                        'marca': marca,
                        'precio_costo': precio_costo,
                        'precio_venta': precio_venta,
                        'stock': stock,
                    }
                )
                if creado:
                    creados += 1
                else:
                    actualizados += 1
            else:
                # Sin código de barras: usar nombre + rubro para evitar duplicados
                prod, creado = Producto.objects.update_or_create(
                    nombre=nombre,
                    rubro=rubro,
                    defaults={
                        'marca': marca,
                        'precio_costo': precio_costo,
                        'precio_venta': precio_venta,
                        'stock': stock,
                    }
                )
                if creado:
                    creados += 1
                else:
                    actualizados += 1
        except Exception as e:
            errores.append(f"Fila {i}: {str(e)}")

    mensaje = f'{creados} productos creados, {actualizados} actualizados.'
    if errores:
        mensaje += f' Errores: {"; ".join(errores)}'

    return Response({'mensaje': mensaje}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def aumento_general(request):
    """Aplica un porcentaje de aumento a TODOS los productos."""
    porcentaje = request.data.get('porcentaje')
    if porcentaje is None:
        return Response({'error': 'El campo "porcentaje" es obligatorio.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        porcentaje = float(porcentaje)
    except (ValueError, TypeError):
        return Response({'error': 'El porcentaje debe ser un número válido. Ej: "3" para aumento o "-3" para descuento'}, status=status.HTTP_400_BAD_REQUEST)

    productos = Producto.objects.all()
    actualizados = 0
    
    for producto in productos:
        # Calcular el nuevo precio
        nuevo_precio = producto.precio_venta * (Decimal('1') + Decimal(str(porcentaje)) / Decimal('100'))

        # Redondear a múltiplos de 100
        nuevo_precio = (nuevo_precio / Decimal('100')).quantize(Decimal('1'), rounding=ROUND_HALF_UP) * Decimal('100')

        producto.precio_venta = nuevo_precio
        producto.save()
        actualizados += 1

    return Response({
        'mensaje': f'Aumento general del {porcentaje}% aplicado.',
        'productos_actualizados': actualizados
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def aumento_por_rubro(request):
    """Aplica un porcentaje de aumento a todos los productos de un rubro."""
    rubro_id = request.data.get('rubro_id')
    porcentaje = request.data.get('porcentaje')

    if not rubro_id or porcentaje is None:
        return Response({'error': 'Los campos "rubro_id" y "porcentaje" son obligatorios.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        porcentaje = float(porcentaje)
    except (ValueError, TypeError):
        return Response({'error': 'El porcentaje debe ser un número válido. Ej: "3" para aumento o "-3" para descuento'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        rubro = Rubro.objects.get(id=rubro_id)
    except Rubro.DoesNotExist:
        return Response({'error': 'El rubro especificado no existe.'}, status=status.HTTP_404_NOT_FOUND)

    productos = Producto.objects.filter(rubro=rubro)
    actualizados = 0

    for producto in productos:
        # Calcular el nuevo precio
        nuevo_precio = producto.precio_venta * (Decimal('1') + Decimal(str(porcentaje)) / Decimal('100'))

        # Redondear a múltiplos de 100
        nuevo_precio = (nuevo_precio / Decimal('100')).quantize(Decimal('1'), rounding=ROUND_HALF_UP) * Decimal('100')
        producto.precio_venta = nuevo_precio
        producto.save()
        actualizados += 1

    return Response({
        'mensaje': f'Aumento del {porcentaje}% aplicado al rubro "{rubro.nombre}".',
        'productos_actualizados': actualizados
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def aumento_por_marca(request):
    """Aplica un porcentaje de aumento a todos los productos de una marca."""
    marca_id = request.data.get('marca_id')
    porcentaje = request.data.get('porcentaje')

    if not marca_id or porcentaje is None:
        return Response({'error': 'Los campos "marca_id" y "porcentaje" son obligatorios.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        porcentaje = float(porcentaje)
    except (ValueError, TypeError):
        return Response({'error': 'El porcentaje debe ser un número válido. Ej: "3" para aumento o "-3" para descuento'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        marca = Marca.objects.get(id=marca_id)
    except Marca.DoesNotExist:
        return Response({'error': 'La marca especificada no existe.'}, status=status.HTTP_404_NOT_FOUND)

    productos = Producto.objects.filter(marca=marca)
    actualizados = 0

    for producto in productos:
        # Calcular el nuevo precio
        nuevo_precio = producto.precio_venta * (Decimal('1') + Decimal(str(porcentaje)) / Decimal('100'))

        # Redondear a múltiplos de 100
        nuevo_precio = (nuevo_precio / Decimal('100')).quantize(Decimal('1'), rounding=ROUND_HALF_UP) * Decimal('100')

        producto.precio_venta = nuevo_precio
        producto.save()
        actualizados += 1

    return Response({
        'mensaje': f'Aumento del {porcentaje}% aplicado a la marca "{marca.nombre}".',
        'productos_actualizados': actualizados
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def aumento_individual(request):
    """Aplica un porcentaje de aumento a un producto específico."""
    producto_id = request.data.get('producto_id')
    porcentaje = request.data.get('porcentaje')

    if not producto_id or porcentaje is None:
        return Response({'error': 'Los campos "producto_id" y "porcentaje" son obligatorios.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        porcentaje = float(porcentaje)
    except (ValueError, TypeError):
        return Response({'error': 'El porcentaje debe ser un número válido. Ej: "3" para aumento o "-3" para descuento'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        producto = Producto.objects.get(id=producto_id)
    except Producto.DoesNotExist:
        return Response({'error': 'El producto especificado no existe.'}, status=status.HTTP_404_NOT_FOUND)

    # Calcular el nuevo precio
    nuevo_precio = producto.precio_venta * (Decimal('1') + Decimal(str(porcentaje)) / Decimal('100'))

    # Redondear a múltiplos de 100
    nuevo_precio = (nuevo_precio / Decimal('100')).quantize(Decimal('1'), rounding=ROUND_HALF_UP) * Decimal('100')
    producto.precio_venta = nuevo_precio
    producto.save()

    return Response({
        'mensaje': f'Aumento del {porcentaje}% aplicado a "{producto.nombre}". Nuevo precio: ${producto.precio_venta}.',
    }, status=status.HTTP_200_OK)