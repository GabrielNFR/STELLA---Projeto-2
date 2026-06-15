from rest_framework import serializers
from .models import EventoAgenda, FaseTratamento, ConviteCopiloto, Diario, Medicacao, UserProfile
from django.contrib.auth.models import User


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer para o perfil estendido do usuário"""
    class Meta:
        model = UserProfile
        fields = [
            'id', 'foto_perfil', 'telefone', 'data_nascimento', 'cidade',
            'medica_responsavel', 'protocolo', 'data_inicio_tratamento',
            'criado_em', 'atualizado_em'
        ]
        read_only_fields = ['id', 'criado_em', 'atualizado_em']


class UserDetailSerializer(serializers.ModelSerializer):
    """Serializer para dados do usuário com perfil estendido"""
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id', 'username']


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer para atualizar dados do usuário"""
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name']


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer para atualizar dados do perfil do usuário"""
    class Meta:
        model = UserProfile
        fields = [
            'foto_perfil', 'telefone', 'data_nascimento', 'cidade',
            'medica_responsavel', 'protocolo', 'data_inicio_tratamento'
        ]


class FaseTratamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaseTratamento
        fields = '__all__'


class EventoAgendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoAgenda
        fields = '__all__'
        read_only_fields = ['id', 'criado_em', 'atualizado_em']

class DiarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diario
        fields = [
            'id',
            'humor',
            'sintomas',
            'condicoes_fisiologicas',
            'notas',
            'criado_em',
        ]
        read_only_fields = ['id', 'criado_em']

    def validate_humor(self, value):
        if not value:
            raise serializers.ValidationError("É necessário informar o humor do check-in.")
        return value


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
    
class MedicacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicacao
        fields = "__all__"