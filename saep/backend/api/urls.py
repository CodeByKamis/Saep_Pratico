# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProdutoViewSet, MovimentacaoViewSet, login_usuario
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'products', ProdutoViewSet, basename='products')
router.register(r'movements', MovimentacaoViewSet, basename='movements')

urlpatterns = [
    # rota de login personalizada (usa tabela usuarios)
    path('auth/token/', login_usuario, name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('', include(router.urls)),
]
