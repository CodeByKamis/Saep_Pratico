from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from .models import Product, StockMovement
from .serializers import ProductSerializer, StockMovementSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# -------------------------------
#    LOGIN COM JWT PERSONALIZADO
# -------------------------------
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# ------------------------
#      PRODUTOS
# ------------------------
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("name")
    serializer_class = ProductSerializer

    # GET /api/products/search/?q=produto
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def search(self, request):
        q = request.query_params.get('q', '').strip()
        queryset = self.get_queryset()

        if q:
            queryset = queryset.filter(name__icontains=q)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# ------------------------
#   MOVIMENTAÇÃO DE ESTOQUE
# ------------------------
class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.select_related('product', 'responsible').all()
    serializer_class = StockMovementSerializer

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None

        movement = serializer.save(responsible=user)
        product = movement.product

        # --------------------------
        # RF15 → Atualização do estoque
        # --------------------------
        if movement.movement_type == 'IN':
            product.quantity += movement.quantity
        else:
            product.quantity -= movement.quantity

        product.save()

        # --------------------------
        # RF16 → ALERTA DE ESTOQUE MÍNIMO
        # --------------------------
        self.alerta_estoque_minimo = product.quantity < product.minimum_quantity

    def create(self, request, *args, **kwargs):
        """
        Sobrescrevemos create() para incluir o alerta de estoque mínimo
        na resposta da API.
        """
        response = super().create(request, *args, **kwargs)

        # adiciona o alerta à resposta
        response.data["alerta_estoque_minimo"] = getattr(
            self, "alerta_estoque_minimo", False
        )

        return response

    # Histórico
    @action(detail=False, methods=['get'])
    def history(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
