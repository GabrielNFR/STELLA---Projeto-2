from django.urls import path
from .views import EventoAgendaListCreate, FaseTratamentoList, ConviteCopilotoCreate, DiarioListCreate,MedicacaoListCreate,MedicacaoDetail

urlpatterns = [
    path('fases/', FaseTratamentoList.as_view(), name='lista-fases'),
    path('agenda/', EventoAgendaListCreate.as_view(), name='agenda-list-create'),
    path('diario/', DiarioListCreate.as_view(), name='diario-list-create'),
    path('copiloto/convidar/', ConviteCopilotoCreate.as_view(), name='copiloto-convidar'),
    path("medicacoes/",MedicacaoListCreate.as_view(),name="medicacoes-list"),
    path("medicacoes/<int:pk>/",MedicacaoDetail.as_view(),name="medicacoes-detail"),
]
