from django.db import models

# Create your models here.
class Producto(models.Model):
    nombre = models.CharField(max_length=100, unique=True) 
    descripcion = models.TextField(blank=True, null=True)
    precio = models.PositiveIntegerField() 
    stock = models.PositiveIntegerField(default=0) 
    disponible = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"{self.nombre} - ${self.precio}"