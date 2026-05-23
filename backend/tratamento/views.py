from rest_framework import generics, permissions
from rest_framework.authentication import TokenAuthentication
from .models import EventoAgenda, FaseTratamento, ConviteCopiloto, Diario
from .serializers import EventoAgendaSerializer, FaseTratamentoSerializer, ConviteCopilotoSerializer, DiarioSerializer
from django.contrib.auth.models import User

class FaseTratamentoList(generics.ListAPIView):
    queryset = FaseTratamento.objects.all()
    serializer_class = FaseTratamentoSerializer


class EventoAgendaListCreate(generics.ListCreateAPIView):
    queryset = EventoAgenda.objects.all()
    serializer_class = EventoAgendaSerializer


class DiarioListCreate(generics.ListCreateAPIView):
    serializer_class = DiarioSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Diario.objects.filter(paciente=self.request.user)

    def perform_create(self, serializer):
        serializer.save(paciente=self.request.user)


# Mock user
class ConviteCopilotoCreate(generics.CreateAPIView):
    queryset = ConviteCopiloto.objects.all()
    serializer_class = ConviteCopilotoSerializer

    def perform_create(self, serializer):
        usuario_teste = User.objects.first() 
        serializer.save(paciente=usuario_teste)