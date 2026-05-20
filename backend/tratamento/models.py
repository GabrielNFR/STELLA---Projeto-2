from django.db import models


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
