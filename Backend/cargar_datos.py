import os
import django
from unidecode import unidecode

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Rubro, Marca, Producto
from django.contrib.auth.models import User, Group

def estandarizar(texto):
    if not texto:
        return texto
    return unidecode(str(texto).strip().upper())

print("Iniciando carga de datos...")

# ========== RUBROS (5) ==========
rubros_data = [
    {'nombre': 'Librería', 'descripcion': 'Artículos escolares, oficina y papelería'},
    {'nombre': 'Juguetería', 'descripcion': 'Juguetes para todas las edades'},
    {'nombre': 'Regalería', 'descripcion': 'Artículos de regalo, cotillón y decoración'},
    {'nombre': 'Limpieza', 'descripcion': 'Productos de limpieza para el hogar'},
    {'nombre': 'Ferretería', 'descripcion': 'Herramientas y artículos de ferretería'},
]

for r in rubros_data:
    Rubro.objects.get_or_create(nombre=estandarizar(r['nombre']), defaults={'descripcion': estandarizar(r['descripcion'])})
print(f"✅ {Rubro.objects.count()} rubros cargados.")

# ========== MARCAS (10) ==========
marcas_data = [
    {'nombre': 'Rivadavia'},
    {'nombre': 'Bic'},
    {'nombre': 'Faber-Castell'},
    {'nombre': 'Pelikan'},
    {'nombre': 'Mr. Músculo'},
    {'nombre': 'Ayudín'},
    {'nombre': 'Lusqtoff'},
    {'nombre': 'Black & Decker'},
    {'nombre': 'Tramontina'},
    {'nombre': 'Genérica'},
]

for m in marcas_data:
    Marca.objects.get_or_create(nombre=estandarizar(m['nombre']))
print(f"✅ {Marca.objects.count()} marcas cargadas.")

# ========== PRODUCTOS (15) ==========
productos_data = [
    {
        'nombre': 'Cuaderno Rivadavia 100 hojas',
        'descripcion': 'Cuaderno tapa dura, rayado, 21 x 28 cm',
        'codigo_barras': '7791234567801',
        'precio_costo': 500.00,
        'precio_venta': 850.00,
        'stock': 100,
        'rubro': 'Librería',
        'marca': 'Rivadavia',
    },
    {
        'nombre': 'Lapicera Bic Azul',
        'descripcion': 'Lapicera de tinta azul, punta fina',
        'codigo_barras': '7791234567802',
        'precio_costo': 50.00,
        'precio_venta': 120.00,
        'stock': 500,
        'rubro': 'Librería',
        'marca': 'Bic',
    },
    {
        'nombre': 'Lápices de colores Faber-Castell x12',
        'descripcion': 'Set de 12 lápices de colores, madera reforestada',
        'codigo_barras': '7791234567803',
        'precio_costo': 300.00,
        'precio_venta': 550.00,
        'stock': 50,
        'rubro': 'Librería',
        'marca': 'Faber-Castell',
    },
    {
        'nombre': 'Resma de papel A4 x500',
        'descripcion': 'Papel blanco 80 gramos, tamaño A4, paquete de 500 hojas',
        'codigo_barras': '7791234567804',
        'precio_costo': 1200.00,
        'precio_venta': 1800.00,
        'stock': 30,
        'rubro': 'Librería',
        'marca': 'Genérica',
    },
    {
        'nombre': 'Pelota de fútbol N°5',
        'descripcion': 'Pelota de fútbol profesional, cuero sintético',
        'codigo_barras': '7791234567805',
        'precio_costo': 2000.00,
        'precio_venta': 3500.00,
        'stock': 20,
        'rubro': 'Juguetería',
        'marca': 'Genérica',
    },
    {
        'nombre': 'Bloques de construcción x100',
        'descripcion': 'Set de 100 bloques plásticos encastrables, colores variados',
        'codigo_barras': '7791234567806',
        'precio_costo': 800.00,
        'precio_venta': 1400.00,
        'stock': 40,
        'rubro': 'Juguetería',
        'marca': 'Genérica',
    },
    {
        'nombre': 'Muñeca articulada con accesorios',
        'descripcion': 'Muñeca de 30 cm, articulada, incluye ropa y accesorios',
        'codigo_barras': '7791234567807',
        'precio_costo': 1500.00,
        'precio_venta': 2500.00,
        'stock': 15,
        'rubro': 'Juguetería',
        'marca': 'Genérica',
    },
    {
        'nombre': 'Vela aromática de vainilla',
        'descripcion': 'Vela de cera de soja, aroma a vainilla, 200 gramos',
        'codigo_barras': '7791234567808',
        'precio_costo': 350.00,
        'precio_venta': 600.00,
        'stock': 60,
        'rubro': 'Regalería',
        'marca': 'Genérica',
    },
    {
        'nombre': 'Portarretrato de madera 15x20',
        'descripcion': 'Portarretrato de madera tallada, color nogal, para foto 15x20 cm',
        'codigo_barras': '7791234567809',
        'precio_costo': 450.00,
        'precio_venta': 800.00,
        'stock': 25,
        'rubro': 'Regalería',
        'marca': 'Genérica',
    },
    {
        'nombre': 'Set de cotillón infantil x20',
        'descripcion': 'Gorros, silbatos, serpentinas y globos para fiesta infantil',
        'codigo_barras': '7791234567810',
        'precio_costo': 200.00,
        'precio_venta': 400.00,
        'stock': 80,
        'rubro': 'Regalería',
        'marca': 'Genérica',
    },
    {
        'nombre': 'Limpiador multiuso Mr. Músculo 500ml',
        'descripcion': 'Limpiador líquido multiuso, aroma lavanda, gatillo',
        'codigo_barras': '7791234567811',
        'precio_costo': 250.00,
        'precio_venta': 450.00,
        'stock': 70,
        'rubro': 'Limpieza',
        'marca': 'Mr. Músculo',
    },
    {
        'nombre': 'Esponja de acero Ayudín x5',
        'descripcion': 'Pack de 5 esponjas de acero inoxidable para limpieza profunda',
        'codigo_barras': '7791234567812',
        'precio_costo': 100.00,
        'precio_venta': 200.00,
        'stock': 150,
        'rubro': 'Limpieza',
        'marca': 'Ayudín',
    },
    {
        'nombre': 'Desodorante de piso Lusqtoff 900ml',
        'descripcion': 'Desodorante y limpiador para pisos, aroma floral, concentrado',
        'codigo_barras': '7791234567813',
        'precio_costo': 180.00,
        'precio_venta': 350.00,
        'stock': 90,
        'rubro': 'Limpieza',
        'marca': 'Lusqtoff',
    },
    {
        'nombre': 'Taladro eléctrico Black & Decker 550W',
        'descripcion': 'Taladro percutor de 550W, incluye maletín y accesorios',
        'codigo_barras': '7791234567814',
        'precio_costo': 8000.00,
        'precio_venta': 12000.00,
        'stock': 10,
        'rubro': 'Ferretería',
        'marca': 'Black & Decker',
    },
    {
        'nombre': 'Kit de destornilladores Tramontina x8',
        'descripcion': 'Set de 8 destornilladores, punta imantada, mango ergonómico',
        'codigo_barras': '7791234567815',
        'precio_costo': 1200.00,
        'precio_venta': 2000.00,
        'stock': 25,
        'rubro': 'Ferretería',
        'marca': 'Tramontina',
    },
]

for p in productos_data:
    rubro = Rubro.objects.get(nombre=estandarizar(p['rubro']))
    marca = Marca.objects.get(nombre=estandarizar(p['marca']))
    Producto.objects.get_or_create(
        codigo_barras=p['codigo_barras'],
        defaults={
            'nombre': estandarizar(p['nombre']),
            'descripcion': estandarizar(p['descripcion']),
            'precio_costo': p['precio_costo'],
            'precio_venta': p['precio_venta'],
            'stock': p['stock'],
            'rubro': rubro,
            'marca': marca,
        }
    )


# ========== USUARIOS ==========
# Crear grupos si no existen
admin_group, _ = Group.objects.get_or_create(name='Administrador')
empleado_group, _ = Group.objects.get_or_create(name='Empleado')

# Usuario administrador
admin_user, created_admin = User.objects.get_or_create(
    username='ana',
    defaults={'email': 'ana@libreria.com'}
)
if created_admin:
    admin_user.set_password('admin123')
    admin_user.groups.add(admin_group)
    admin_user.save()
    print("✅ Usuario administrador 'ana' creado.")
else:
    print("ℹ️ El usuario 'ana' ya existe, no se modificó.")

# Usuario empleado
empleado_user, created_empleado = User.objects.get_or_create(
    username='juan',
    defaults={'email': 'juan@libreria.com'}
)
if created_empleado:
    empleado_user.set_password('empleado123')
    empleado_user.groups.add(empleado_group)
    empleado_user.save()
    print("✅ Usuario empleado 'juan' creado.")
else:
    print("ℹ️ El usuario 'juan' ya existe, no se modificó.")

print(f"✅ {Producto.objects.count()} productos cargados.")
print("🎉 Carga de datos iniciales completada.")
