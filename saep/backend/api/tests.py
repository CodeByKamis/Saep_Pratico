# backend/api/tests.py
from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from .models import Usuario, Produto, Movimentacao
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password

class APITests(TestCase):

    def setUp(self):
        #cria usuário na tabela Usuario
        self.usuario = Usuario.objects.create(
            nome="Teste",
            login="teste",
            senha=make_password("123"),
            ativo=True
        )

        #cria Django User para autenticação JWT
        self.django_user, created = User.objects.get_or_create(
            username=self.usuario.login,
            defaults={'first_name': self.usuario.nome}
        )

        # Gera token JWT para usar nos testes
        refresh = RefreshToken.for_user(self.django_user)
        self.token = str(refresh.access_token)

        #cliente API com autenticação
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

        #cria produtos de teste
        self.produto1 = Produto.objects.create(nome="Parafuso M6", descricao="Parafuso", estoque_atual=100, estoque_min=50)
        self.produto2 = Produto.objects.create(nome="Arruela 8mm", descricao="Arruela", estoque_atual=200, estoque_min=80)

    # testes Produtos
    def test_list_produtos(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 2)

    def test_create_produto(self):
        data = {"nome": "Porca M8", "descricao": "Porca", "estoque_atual": 150, "estoque_min": 50}
        response = self.client.post('/api/products/', data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Produto.objects.filter(nome="Porca M8").count(), 1)

    def test_update_produto(self):
        data = {"nome": "Parafuso M6 Atualizado", "descricao": "Parafuso atualizado", "estoque_atual": 120, "estoque_min": 50}
        response = self.client.put(f'/api/products/{self.produto1.id_produto}/', data, format='json')
        self.assertEqual(response.status_code, 200)
        self.produto1.refresh_from_db()
        self.assertEqual(self.produto1.nome, "Parafuso M6 Atualizado")

    def test_delete_produto(self):
        response = self.client.delete(f'/api/products/{self.produto2.id_produto}/')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Produto.objects.filter(id_produto=self.produto2.id_produto).exists())

  
    # testes Movimentações
    def test_create_movimentacao(self):
        data = {"id_produto": self.produto1.id_produto, "id_usuario": self.usuario.id_usuario, "tipo": "entrada", "quantidade": 50, "data_movimentacao": "2025-11-27"}
        response = self.client.post('/api/movements/', data, format='json')
        self.assertEqual(response.status_code, 201)
        self.produto1.refresh_from_db()
        self.assertEqual(self.produto1.estoque_atual, 150)  # 100 + 50

    def test_list_movimentacoes(self):
        # Cria uma movimentação para teste
        Movimentacao.objects.create(id_produto=self.produto1, id_usuario=self.usuario, tipo="entrada", quantidade=10, data_movimentacao="2025-11-27")
        response = self.client.get('/api/movements/')
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)
