from django.urls import path
from .views import EventoAgendaListCreate, FaseTratamentoList, ConviteCopilotoCreate, DiarioListCreate

urlpatterns = [
    path('fases/', FaseTratamentoList.as_view(), name='lista-fases'),
    path('agenda/', EventoAgendaListCreate.as_view(), name='agenda-list-create'),
    path('diario/', DiarioListCreate.as_view(), name='diario-list-create'),
    path('copiloto/convidar/', ConviteCopilotoCreate.as_view(), name='copiloto-convidar'),
]
