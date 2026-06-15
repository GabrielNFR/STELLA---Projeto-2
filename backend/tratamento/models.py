from django.db import models
from django.contrib.auth.models import User
import uuid
from django.core.validators import FileExtensionValidator


class UserProfile(models.Model):
    """Perfil estendido do usuário com informações pessoais e do tratamento"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Informações pessoais
    foto_perfil = models.ImageField(
        upload_to='perfil/fotos/',
        null=True,
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif'])]
    )
    telefone = models.CharField(max_length=20, blank=True)
    data_nascimento = models.DateField(null=True, blank=True)
    cidade = models.CharField(max_length=100, blank=True)
    
    # Informações do tratamento
    medica_responsavel = models.CharField(max_length=150, blank=True)
    protocolo = models.CharField(max_length=100, blank=True)
    data_inicio_tratamento = models.DateField(null=True, blank=True)
    
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Perfil de {self.user.get_full_name() or self.user.username}"
    
    class Meta:
        verbose_name = "Perfil de Usuário"
        verbose_name_plural = "Perfis de Usuário"


class FaseTratamento(models.Model):
    STATUS_CHOICES = [
        ('concluida', 'Concluída'),
        ('atual', 'Atual'),
        ('pendente', 'Pendente'),
    ]

    # Os campos da nossa tabela
    nome = models.CharField(max_length=100) 
    ordem_cronologica = models.IntegerField() 
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pendente'
    )
    descricao = models.TextField(blank=True) 

    def __str__(self):
        return f"{self.ordem_cronologica} - {self.nome} ({self.get_status_display()})"
    
    class Meta:
        ordering = ['ordem_cronologica']


class EventoAgenda(models.Model):
    TIPO_CHOICES = [
        ('consulta', 'Consulta'),
        ('exame', 'Exame'),
    ]

    titulo = models.CharField(max_length=120)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    data = models.DateField()
    horario = models.TimeField()
    local = models.CharField(max_length=120, blank=True)
    observacoes = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_tipo_display()} - {self.titulo} em {self.data} às {self.horario}"

    class Meta:
        ordering = ['data', 'horario', 'titulo']

class ConviteCopiloto(models.Model):
    STATUS_CONVITE = [
        ('pendente', 'Pendente'),
        ('aceito', 'Aceito'),
        ('cancelado', 'Cancelado'),
    ]

    paciente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='convites_enviados')
    nome_identificador = models.CharField(max_length=100, help_text="Ex: Marido, Minha Mãe")
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CONVITE, default='pendente')
    
    # Permissões do Link
    perm_ver_fase = models.BooleanField(default=True)
    perm_ver_agenda = models.BooleanField(default=True)
    perm_ver_medicacoes = models.BooleanField(default=True)
    perm_receber_lembretes = models.BooleanField(default=True)
    
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Convite: {self.nome_identificador} ({self.status})"

class VinculoCopiloto(models.Model):
    paciente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='paciente_vinculo')
    copiloto = models.ForeignKey(User, on_delete=models.CASCADE, related_name='copiloto_vinculo')
    convite_origem = models.OneToOneField(ConviteCopiloto, on_delete=models.SET_NULL, null=True)
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Co-piloto: {self.copiloto.username} (Paciente: {self.paciente.username})"


class Diario(models.Model):
    paciente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='diarios')
    humor = models.CharField(max_length=50)
    sintomas = models.JSONField(default=list, blank=True)
    condicoes_fisiologicas = models.JSONField(default=list, blank=True)
    notas = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-criado_em']

    def __str__(self):
        return f"Check-in de {self.paciente.username} em {self.criado_em:%d/%m/%Y %H:%M}"
    

class Medicacao(models.Model):
    nome = models.CharField(max_length=100)
    dose = models.CharField(max_length=50)

    data_inicio = models.DateField()
    data_fim = models.DateField(
        null=True,
        blank=True
    )

    horarios = models.JSONField()
    
    def __str__(self):
        return self.nome