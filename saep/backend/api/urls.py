from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, StockMovementViewSet, MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'movements', StockMovementViewSet)

urlpatterns = [
    # JWT
    path('auth/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Rotas da API
    path('', include(router.urls)),
]
