from django.db import models
from django.contrib.auth.models import User

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=150)
    login = models.CharField(max_length=100, unique=True)
    senha = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class Product(models.Model):
    sku = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    quantity = models.IntegerField(default=0)
    minimum_quantity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.sku})"

class StockMovement(models.Model):
    MOVEMENT_CHOICES = (
        ('IN', 'Entrada'),
        ('OUT', 'Saída'),
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='movements')
    movement_type = models.CharField(max_length=3, choices=MOVEMENT_CHOICES)
    quantity = models.IntegerField()
    responsible = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
