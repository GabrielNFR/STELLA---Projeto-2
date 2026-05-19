from django.contrib import admin
from .models import FaseTratamento

@admin.register(FaseTratamento)
class FaseTratamentoAdmin(admin.ModelAdmin):
    list_display = ('ordem_cronologica', 'nome', 'status')
    list_filter = ('status',)
    search_fields = ('nome',)
    ordering = ('ordem_cronologica',)