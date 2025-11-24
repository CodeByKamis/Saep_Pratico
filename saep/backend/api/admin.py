# backend/api/admin.py
from django.contrib import admin
from .models import Usuario, Produto, Movimentacao

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ("id_usuario", "login", "nome")
    search_fields = ("login", "nome")


@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ("id_produto", "nome", "estoque_atual", "estoque_min")
    search_fields = ("nome",)


@admin.register(Movimentacao)
class MovimentacaoAdmin(admin.ModelAdmin):
    list_display = ("id_movimentacao", "id_produto", "id_usuario", "tipo", "quantidade", "data_movimentacao")
    list_filter = ("tipo", "data_movimentacao")
    search_fields = ("id_produto__nome", "id_usuario__login")
