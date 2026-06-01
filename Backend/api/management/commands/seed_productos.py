from django.core.management.base import BaseCommand
from api.models import Rubro, Marca, Producto
from decimal import Decimal
import random
from datetime import timedelta
from django.utils import timezone


class Command(BaseCommand):
    help = "Carga 50 productos de prueba (10 por rubro)"

    RUBROS = {
        "Lápices": {
            "desc": "Lápices, portaminas y accesorios",
            "marcas": ["Faber-Castell", "Staedtler", "Bic", "Pelikan", "Artesco"],
            "productos": [
                ("Lápiz Grafito HB N°2", "Lápiz negro estándar para escritura", 180, 350, 120, "Faber-Castell"),
                ("Lápiz Grafito 2B", "Lápiz blando para dibujo artístico", 220, 420, 80, "Faber-Castell"),
                ("Lápiz Grafito 4H", "Lápiz duro para delineado técnico", 250, 480, 60, "Staedtler"),
                ("Portaminas 0.5 mm", "Portaminas metálico con goma", 650, 1200, 40, "Staedtler"),
                ("Portaminas 0.7 mm", "Portaminas plástico resistente", 550, 1050, 35, "Bic"),
                ("Minas 0.5 mm HB (12 u.)", "Caja de minas de repuesto 0.5mm", 300, 580, 50, "Staedtler"),
                ("Minas 0.7 mm HB (12 u.)", "Caja de minas de repuesto 0.7mm", 280, 550, 45, "Bic"),
                ("Goma de borrar blanca", "Goma de borrar suave para lápiz", 120, 250, 200, "Pelikan"),
                ("Goma de borrar lápiz tinta", "Goma bifaz borra lápiz y tinta", 200, 380, 100, "Faber-Castell"),
                ("Sacapuntas metálico", "Sacapuntas doble orificio metálico", 180, 350, 90, "Artesco"),
            ],
        },
        "Acrílicos": {
            "desc": "Pinturas acrílicas y pinceles",
            "marcas": ["Artesco", "Pelikan", "Faber-Castell", "Alba", "Ferlap"],
            "productos": [
                ("Acrílico 12 colores x 12ml", "Set de acrílicos escolares 12 colores", 2500, 4500, 15, "Artesco"),
                ("Acrílico 6 colores x 20ml", "Set acrílico colores básicos", 1800, 3200, 20, "Pelikan"),
                ("Acrílico blanco 250ml", "Pintura acrílica blanca para manualidades", 1200, 2200, 25, "Alba"),
                ("Pincel redondo n°2", "Pincel punta redonda para detalle", 350, 650, 60, "Artesco"),
                ("Pincel plano n°6", "Pincel plano cerdas sintéticas", 450, 850, 55, "Faber-Castell"),
                ("Pincel lengua de gato n°4", "Pincel lengua de gato para difuminar", 500, 950, 40, "Artesco"),
                ("Lienzo 20x30 cm", "Lienzo para acrílico sobre bastidor", 800, 1500, 30, "Ferlap"),
                ("Lienzo 30x40 cm", "Lienzo profesional para acrílico", 1200, 2200, 25, "Ferlap"),
                ("Paleta plástica", "Paleta mezcladora de pintura acrílica", 250, 500, 70, "Alba"),
                ("Barniz acrílico brillante 250ml", "Barniz sellador para acabado brillante", 1500, 2800, 20, "Pelikan"),
            ],
        },
        "Hojas": {
            "desc": "Hojas, resmas y papeles",
            "marcas": ["Ledesma", "Rivadavia", "El Nene", "Cartier", "Mapa"],
            "productos": [
                ("Resma A4 80g (500 hojas)", "Papel blanco para impresión", 3500, 6000, 10, "Ledesma"),
                ("Resma A4 75g (500 hojas)", "Papel económico para uso diario", 3000, 5200, 12, "Rivadavia"),
                ("Block A4 cuadriculado", "Block universitario cuadrícula 100 hojas", 1200, 2200, 30, "El Nene"),
                ("Block A4 rayado", "Block universitario rayado 100 hojas", 1100, 2100, 35, "El Nene"),
                ("Block A4 liso", "Block universitario liso 100 hojas", 1100, 2100, 28, "Cartier"),
                ("Cartulina color A4 (10u.)", "Cartulina de colores surtidos 180g", 800, 1500, 40, "Mapa"),
                ("Papel crepé 6 colores", "Papel crepé para manualidades 50x200cm", 400, 750, 50, "Mapa"),
                ("Papel afiche 10 colores", "Papel afiche brillante A3 10 hojas", 900, 1700, 35, "Cartier"),
                ("Block de dibujo A4", "Block para dibujo con espiral 50 hojas", 1400, 2600, 25, "Rivadavia"),
                ("Cartón gris A4 (5u.)", "Cartón gris 2mm para maquetas", 600, 1100, 45, "Mapa"),
            ],
        },
        "Varios": {
            "desc": "Artículos de librería varios",
            "marcas": ["Bic", "Pelikan", "Voligoma", "La Gotita", "Scotch"],
            "productos": [
                ("Bolígrafo azul Bic Cristal", "Bolígrafo punta fina tinta azul", 100, 200, 300, "Bic"),
                ("Bolígrafo negro Bic", "Bolígrafo punta fina tinta negra", 100, 200, 280, "Bic"),
                ("Marcador permanente negro", "Marcador indeleble punta fina", 250, 500, 80, "Pelikan"),
                ("Resaltador fluorescente amarillo", "Resaltador pastel para textos", 200, 400, 100, "Pelikan"),
                ("Tijera escolar punta roma", "Tijera acero inoxidable para niños", 350, 650, 50, "Pelikan"),
                ("Voligoma 250ml", "Adhesivo vinílico escolar", 400, 750, 40, "Voligoma"),
                ("La Gotita 30g", "Adhesivo instantáneo de uso general", 250, 500, 90, "La Gotita"),
                ("Cinta adhesiva transparente", "Cinta adhesiva 12mm x 10m", 150, 300, 120, "Scotch"),
                ("Regla 30cm acrílica", "Regla transparente flexible 30cm", 200, 400, 70, "Pelikan"),
                ("Engrapadora de escritorio", "Engrapadora metálica 26/6", 1200, 2200, 20, "Bic"),
            ],
        },
        "Cuadernos": {
            "desc": "Cuadernos y libretas",
            "marcas": ["Rivadavia", "El Nene", "Ledesma", "Cartier", "Gloria"],
            "productos": [
                ("Cuaderno A4 rayado 48 hojas", "Cuaderno tapa dura espiral", 1800, 3200, 25, "Rivadavia"),
                ("Cuaderno A4 cuadriculado 48 hojas", "Cuaderno tapa blanda cosido", 1700, 3000, 30, "El Nene"),
                ("Cuaderno A5 rayado 96 hojas", "Cuaderno tapa dura cosido", 2200, 4000, 20, "Ledesma"),
                ("Cuaderno A5 cuadriculado 96 hojas", "Cuaderno tapa blanda espiral", 2000, 3800, 22, "Cartier"),
                ("Cuaderno tapa dura A4 96 hojas", "Cuaderno lujo rayado 96 hojas", 3500, 6200, 15, "Rivadavia"),
                ("Libreta A5 tapa blanda", "Libreta rayada con cierre elástico", 2500, 4500, 18, "Gloria"),
                ("Libreta de apuntes A6", "Libreta pequeña con espiral 80 hojas", 1000, 1900, 35, "El Nene"),
                ("Cuaderno de dibujo A4", "Cuaderno hoja lisa para dibujo 48 hojas", 2000, 3600, 20, "Cartier"),
                ("Agenda 2026 semanal A5", "Agenda semanal con cierre elástico", 4000, 7200, 12, "Rivadavia"),
                ("Cuaderno anillado A4 100 hojas", "Cuaderno carpeta anillada rayado", 2800, 5000, 16, "Ledesma"),
            ],
        },
    }

    def handle(self, *args, **options):
        self.stdout.write("Cargando datos de prueba...")

        marca_obj = {}

        for rubro_nombre, rubro_data in self.RUBROS.items():
            rubro, _ = Rubro.objects.get_or_create(
                nombre=rubro_nombre,
                defaults={"descripcion": rubro_data["desc"]},
            )
            self.stdout.write(f"  Rubro: {rubro_nombre}")

            for marca_nombre in rubro_data["marcas"]:
                if marca_nombre not in marca_obj:
                    marca_obj[marca_nombre], _ = Marca.objects.get_or_create(
                        nombre=marca_nombre
                    )

            for prod_data in rubro_data["productos"]:
                nombre, desc, costo, venta, stock, marca_nombre = prod_data
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
                        "marca": marca_obj[marca_nombre],
                        "fecha_creacion": timezone.now()
                        - timedelta(days=random.randint(0, 180)),
                    },
                )

            self.stdout.write(f"    -> {len(rubro_data['productos'])} productos creados")

        total = Producto.objects.count()
        self.stdout.write(self.style.SUCCESS(f"  Total productos: {total}"))
