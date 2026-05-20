from rest_framework import serializers
from .models import EventoAgenda, FaseTratamento


class FaseTratamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaseTratamento
        fields = '__all__'


class EventoAgendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoAgenda
        fields = '__all__'
        read_only_fields = ['id', 'criado_em', 'atualizado_em']
