from django.contrib import admin
from .models import FaseTratamento, ConviteCopiloto, VinculoCopiloto

@admin.register(FaseTratamento)
class FaseTratamentoAdmin(admin.ModelAdmin):
    list_display = ('ordem_cronologica', 'nome', 'status')
    list_filter = ('status',)
    search_fields = ('nome',)
    ordering = ('ordem_cronologica',)

@admin.register(ConviteCopiloto)
class ConviteCopilotoAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'nome_identificador', 'status', 'criado_em')
    list_filter = ('status',)
    search_fields = ('nome_identificador',)

@admin.register(VinculoCopiloto)
class VinculoCopilotoAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'copiloto', 'ativo')
    list_filter = ('ativo',)