# backend/api/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Usuario, Produto, Movimentacao
from .serializers import UsuarioSerializer, ProdutoSerializer, MovimentacaoSerializer

# ---------------------------
# AUTENTICAÇÃO (JWT) - usa tabela 'usuarios'
# ---------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_usuario(request):
    """
    Espera: { "username": "<login>", "password": "<senha>" }
    Autentica na tabela usuarios e retorna access + refresh JWT (simplejwt),
    além dos dados do usuário (vindo da tabela usuarios).
    """
    data = request.data
    username = data.get('username') or data.get('login')
    password = data.get('password') or data.get('senha')

    if not username or not password:
        return Response({'detail': 'username e password obrigatórios'}, status=400)

    try:
        usuario = Usuario.objects.get(login=username, ativo=True)
    except Usuario.DoesNotExist:
        return Response({'detail': 'Usuário não encontrado ou inativo'}, status=401)

    senha_armazenada = usuario.senha or ''

    # tenta validar hash
    senha_valida = False
    try:
        senha_valida = check_password(password, senha_armazenada)
    except Exception:
        senha_valida = False

    # caso senha armazenada esteja em claro (ex: '1234567ka'), permita e converta para hash
    if not senha_valida and senha_armazenada == password:
        # re-hash e salva
        usuario.senha = make_password(password)
        usuario.save()
        senha_valida = True

    if not senha_valida:
        return Response({'detail': 'Usuário ou senha inválidos'}, status=401)

    # agora que usuário autenticou, mapeia para um Django User (necessário para gerar token com simplejwt)
    django_user, created = User.objects.get_or_create(username=usuario.login, defaults={
        'first_name': usuario.nome
    })
    # se precisar, atualizar nome
    if django_user.first_name != usuario.nome:
        django_user.first_name = usuario.nome
        django_user.save()

    # cria tokens
    refresh = RefreshToken.for_user(django_user)
    access = str(refresh.access_token)

    serializer = UsuarioSerializer(usuario)

    return Response({
        'access': access,
        'refresh': str(refresh),
        'user': serializer.data
    })


# ---------------------------
# PRODUTOS
# ---------------------------
class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all().order_by('nome')
    serializer_class = ProdutoSerializer

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def search(self, request):
        q = request.query_params.get('q', '').strip()
        qs = self.get_queryset()
        if q:
            qs = qs.filter(nome__icontains=q)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


# ---------------------------
# MOVIMENTAÇÕES (atualiza estoque)
# ---------------------------
class MovimentacaoViewSet(viewsets.ModelViewSet):
    queryset = Movimentacao.objects.select_related('produto', 'usuario').all()
    serializer_class = MovimentacaoSerializer

    def perform_create(self, serializer):
        mov = serializer.save()
        produto = mov.produto
        # atualiza estoque conforme tipo
        if mov.tipo == 'entrada':
            produto.estoque_atual = produto.estoque_atual + mov.quantidade
        else:
            produto.estoque_atual = produto.estoque_atual - mov.quantidade
        produto.save()

    @action(detail=False, methods=['get'])
    def history(self, request):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
