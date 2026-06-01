from django.core.management.base import BaseCommand
from api.models import Rubro, Marca, Producto
from decimal import Decimal
import random
from datetime import timedelta
from django.utils import timezone


class Command(BaseCommand):
    help = "Agrega 50 productos adicionales (10 por rubro)"

    PRODUCTOS = {
        "Lápices": [
            ("Lápiz de color rojo", "Lápiz de color para dibujo artístico", 250, 480, 60, "Faber-Castell"),
            ("Lápiz de color azul", "Lápiz de color para colorear", 250, 480, 65, "Faber-Castell"),
            ("Lápiz de color verde", "Lápiz de color verde intenso", 250, 480, 55, "Faber-Castell"),
            ("Lápiz acuarelable 6 colores", "Set lápices acuarelables surtidos", 1800, 3200, 20, "Pelikan"),
            ("Portaminas 0.3 mm", "Portaminas técnico para delineado fino", 700, 1350, 30, "Staedtler"),
            ("Goma de borrar eléctrica", "Goma recargable con pilas", 2500, 4500, 10, "Artesco"),
            ("Lápiz mecánico 0.9 mm", "Lápiz portaminas para dibujo grueso", 600, 1150, 25, "Bic"),
            ("Minas de colores 2mm (12u)", "Minas de colores para portaminas 2mm", 450, 850, 35, "Staedtler"),
            ("Lápiz carpintero", "Lápiz plano para carpintería", 150, 300, 80, "Bic"),
            ("Barra de grafito 4B", "Barra de grafito para dibujo artístico", 350, 680, 40, "Faber-Castell"),
        ],
        "Acrílicos": [
            ("Acrílico negro 250ml", "Pintura acrílica negra base", 1200, 2200, 20, "Alba"),
            ("Acrílico rojo 250ml", "Pintura acrílica rojo intenso", 1200, 2200, 18, "Alba"),
            ("Pincel abanico n°8", "Pincel abanico para texturas", 600, 1150, 30, "Artesco"),
            ("Pincel angular 1/2 pulgada", "Pincel biselado para lettering", 500, 950, 35, "Faber-Castell"),
            ("Espátula para acrílico", "Espátula metálica para empaste", 400, 780, 25, "Ferlap"),
            ("Lienzo 40x50 cm", "Lienzo profesional triple imprimación", 1800, 3300, 15, "Ferlap"),
            ("Lienzo 50x70 cm", "Lienzo grande para obra", 2500, 4600, 10, "Ferlap"),
            ("Set 8 acrílicos 12ml", "Set acrílico colores pastel", 1800, 3200, 20, "Pelikan"),
            ("Medium acrílico 200ml", "Medium para retardar secado", 1400, 2600, 15, "Alba"),
            ("Barniz acrílico mate 250ml", "Barniz sellador acabado mate", 1500, 2800, 18, "Pelikan"),
        ],
        "Hojas": [
            ("Resma A3 80g (500 hojas)", "Papel tamaño A3 para impresión", 7000, 12000, 8, "Ledesma"),
            ("Block A5 rayado", "Block pequeño espiral 100 hojas", 800, 1500, 40, "El Nene"),
            ("Block A5 cuadriculado", "Block A5 cuadrícula 100 hojas", 800, 1500, 38, "El Nene"),
            ("Papel manteca A4 (50u.)", "Papel translúcido para calcar", 600, 1150, 30, "Rivadavia"),
            ("Papel glacé A4 10 colores", "Papel brillante para origami", 500, 950, 45, "Mapa"),
            ("Cartulina negra A4 (10u.)", "Cartulina negra 180g 10 hojas", 800, 1500, 35, "Mapa"),
            ("Block hojas color A4", "Block 50 hojas de colores surtidos", 1000, 1900, 28, "Cartier"),
            ("Papel obra A4 120g (100u.)", "Papel obra para dibujo y pintura", 1800, 3200, 20, "Rivadavia"),
            ("Sobre carta kraft (25u.)", "Sobres tamaño carta papel madera", 400, 800, 50, "Ledesma"),
            ("Etiquetas autoadhesivas A4 (10h)", "Hojas de etiquetas para imprimir", 1200, 2200, 25, "Cartier"),
        ],
        "Varios": [
            ("Bolígrafo rojo Bic", "Bolígrafo punta fina tinta roja", 100, 200, 250, "Bic"),
            ("Bolígrafo 4 colores Bic", "Bolígrafo retráctil 4 colores", 450, 850, 60, "Bic"),
            ("Marcador permanente azul", "Marcador indeleble punta fina azul", 250, 500, 75, "Pelikan"),
            ("Resaltador verde", "Resaltador fluorescente verde", 200, 400, 90, "Pelikan"),
            ("Corrector líquido 20ml", "Corrector blanco de secado rápido", 200, 400, 100, "Pelikan"),
            ("Cinta masking tape 18mm", "Cinta de enmascarar 18mm x 50m", 300, 600, 60, "Scotch"),
            ("Tijera metálica punta fina", "Tijera de precisión para manualidades", 500, 950, 35, "Pelikan"),
            ("Perforadora 3 agujeros", "Perforadora metálica para A4", 1500, 2800, 15, "Bic"),
            ("Abrochadora de mesa", "Engrapadora profesional brazo largo", 2000, 3600, 12, "Bic"),
            ("Clips mariposa 25mm (12u.)", "Clips coloridos para documentos", 150, 300, 120, "Pelikan"),
        ],
        "Cuadernos": [
            ("Cuaderno A4 tapa blanda 48h", "Cuaderno económico rayado", 1200, 2200, 30, "El Nene"),
            ("Cuaderno A5 tapa dura 48h", "Cuaderno rústico cosido", 1500, 2800, 25, "Rivadavia"),
            ("Libreta A7 cuero", "Libreta viajera cubierta cuero sintético", 3000, 5500, 10, "Gloria"),
            ("Cuaderno universitario A4 80h", "Cuaderno tapa blanda argollado", 2500, 4500, 18, "Ledesma"),
            ("Agenda ejecutiva 2026", "Agenda diaria cuero con cierre", 5000, 9000, 8, "Rivadavia"),
            ("Block de notas adhesivas", "Block 100 hojas notas autoadhesivas", 200, 400, 100, "Cartier"),
            ("Cuaderno pentagramado A4", "Cuaderno con pentagrama para música", 2000, 3600, 15, "El Nene"),
            ("Libreta tapa blanda puntos", "Libreta con puntos para bullet journal", 2800, 5000, 12, "Gloria"),
            ("Cuaderno A3 dibujo 48h", "Cuaderno grande para dibujo técnico", 3500, 6200, 10, "Cartier"),
            ("Set 3 libretas kraft A6", "Set libretas artesanales tapa kraft", 2200, 4000, 20, "El Nene"),
        ],
    }

    def handle(self, *args, **options):
        self.stdout.write("Agregando 50 productos adicionales...")

        for rubro_nombre, productos in self.PRODUCTOS.items():
            try:
                rubro = Rubro.objects.get(nombre=rubro_nombre)
            except Rubro.DoesNotExist:
                self.stdout.write(f"  Rubro '{rubro_nombre}' no encontrado, creando...")
                rubro = Rubro.objects.create(nombre=rubro_nombre, descripcion=f"Productos {rubro_nombre.lower()}")

            for prod_data in productos:
                nombre, desc, costo, venta, stock, marca_nombre = prod_data
                marca, _ = Marca.objects.get_or_create(nombre=marca_nombre)
                codigo = f"LIB-{random.randint(10000, 99999)}"

                Producto.objects.get_or_create(
                    nombre=nombre,
                    defaults={
                        "descripcion": desc,
                        "codigo_barras": codigo,
                        "precio_costo": Decimal(str(costo)),
                        "precio_venta": Decimal(str(venta)),
                        "stock": stock,
                        "rubro": rubro,
                        "marca": marca,
                        "fecha_creacion": timezone.now()
                        - timedelta(days=random.randint(0, 180)),
                    },
                )

            self.stdout.write(f"  {rubro_nombre}: +{len(productos)} productos")

        total = Producto.objects.count()
        self.stdout.write(self.style.SUCCESS(f"  Total productos: {total}"))
