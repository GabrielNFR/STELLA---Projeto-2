from rest_framework import generics
from .models import EventoAgenda, FaseTratamento
from .serializers import EventoAgendaSerializer, FaseTratamentoSerializer

class FaseTratamentoList(generics.ListAPIView):
    queryset = FaseTratamento.objects.all()
    serializer_class = FaseTratamentoSerializer


class EventoAgendaListCreate(generics.ListCreateAPIView):
    queryset = EventoAgenda.objects.all()
    serializer_class = EventoAgendaSerializer
