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