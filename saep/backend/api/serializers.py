# backend/api/serializers.py
from rest_framework import serializers
from .models import Usuario, Produto, Movimentacao

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id_usuario', 'nome', 'login']
        read_only_fields = ['id_usuario']


class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ['id_produto', 'nome', 'descricao', 'estoque_atual', 'estoque_min']
        read_only_fields = ['id_produto']


class MovimentacaoSerializer(serializers.ModelSerializer):
    produto_nome = serializers.CharField(source='id_produto.nome', read_only=True)
    usuario_nome = serializers.CharField(source='id_usuario.nome', read_only=True)

    class Meta:
        model = Movimentacao
        fields = [
            'id_movimentacao',
            'id_produto', 'produto_nome',
            'id_usuario', 'usuario_nome',
            'tipo', 'quantidade', 'data_movimentacao'
        ]
        read_only_fields = ['id_movimentacao', 'produto_nome', 'usuario_nome']
