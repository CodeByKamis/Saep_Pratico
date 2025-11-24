# backend/api/models.py
from django.db import models

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True, db_column='id_usuario')
    nome = models.CharField(max_length=150, db_column='nome')
    login = models.CharField(max_length=80, unique=True, db_column='login')
    senha = models.CharField(max_length=255, db_column='senha')  

    class Meta:
        db_table = 'usuarios'  # Nome da tabela no banco de dados
        # managed=True é padrão e garante que o Django crie as tabelas automaticamente

    def __str__(self):
        return self.nome


class Produto(models.Model):
    id_produto = models.AutoField(primary_key=True, db_column='id_produto')
    nome = models.CharField(max_length=200, db_column='nome')
    descricao = models.CharField(max_length=500, null=True, blank=True, db_column='descricao')
    estoque_atual = models.IntegerField(db_column='estoque_atual')
    estoque_min = models.IntegerField(db_column='estoque_min')

    class Meta:
        db_table = 'produtos'  # Nome da tabela no banco de dados
        ordering = ["nome"]  # Lista os produtos em ordem alfabética (RF11)

    def __str__(self):
        return self.nome


class Movimentacao(models.Model):
    id_movimentacao = models.AutoField(primary_key=True, db_column='id_movimentacao')
    id_produto = models.ForeignKey(
        Produto,
        on_delete=models.RESTRICT,
        db_column='id_produto',
        related_name='movimentacoes'
    )
    id_usuario = models.ForeignKey(
        Usuario,
        on_delete=models.RESTRICT,
        db_column='id_usuario',
        related_name='movimentacoes'
    )
    tipo = models.CharField(max_length=10, db_column='tipo')  # 'entrada' ou 'saida'
    quantidade = models.IntegerField(db_column='quantidade')
    data_movimentacao = models.DateField(db_column='data_movimentacao')

    class Meta:
        db_table = 'movimentacoes'  # Nome da tabela no banco de dados
        ordering = ["-data_movimentacao"]  # Ordena pela data de movimentação (mais recentes primeiro)

    def __str__(self):
        return f"{self.tipo} - {self.id_produto.nome} - {self.quantidade}"
