from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, StockMovement


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','first_name','last_name','email']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id','sku','name','description','quantity','minimum_quantity','created_at']

class StockMovementSerializer(serializers.ModelSerializer):
    responsible = UserSerializer(read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = StockMovement
        fields = ['id','product','product_name','movement_type','quantity','responsible','comment','created_at']
        read_only_fields = ['responsible','created_at','product_name']

alert_low_stock = serializers.SerializerMethodField()

def get_alert_low_stock(self, obj):
    return obj.quantity < obj.minimum_quantity