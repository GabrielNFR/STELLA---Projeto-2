from rest_framework import generics
from .models import EventoAgenda, FaseTratamento, ConviteCopiloto
from .serializers import EventoAgendaSerializer, FaseTratamentoSerializer, ConviteCopilotoSerializer
from django.contrib.auth.models import User

class FaseTratamentoList(generics.ListAPIView):
    queryset = FaseTratamento.objects.all()
    serializer_class = FaseTratamentoSerializer


class EventoAgendaListCreate(generics.ListCreateAPIView):
    queryset = EventoAgenda.objects.all()
    serializer_class = EventoAgendaSerializer


# Mock user
class ConviteCopilotoCreate(generics.CreateAPIView):
    queryset = ConviteCopiloto.objects.all()
    serializer_class = ConviteCopilotoSerializer

    def perform_create(self, serializer):
        usuario_teste = User.objects.first() 
        serializer.save(paciente=usuario_teste)