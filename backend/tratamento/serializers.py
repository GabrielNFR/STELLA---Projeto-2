from rest_framework import serializers
from .models import EventoAgenda, FaseTratamento, ConviteCopiloto


class FaseTratamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaseTratamento
        fields = '__all__'


class EventoAgendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoAgenda
        fields = '__all__'
        read_only_fields = ['id', 'criado_em', 'atualizado_em']

class ConviteCopilotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConviteCopiloto
        # Enviamos o token de volta na resposta para o React criar o link!
        fields = [
            'id', 'nome_identificador', 'token', 'status', 
            'perm_ver_fase', 'perm_ver_agenda', 
            'perm_ver_medicacoes', 'perm_receber_lembretes', 'criado_em'
        ]
        read_only_fields = ['status', 'criado_em', 'token']

    def validate(self, data):
        if not data.get('nome_identificador'):
            raise serializers.ValidationError("É necessário preencher um nome para o parceiro/familiar.")
        return data