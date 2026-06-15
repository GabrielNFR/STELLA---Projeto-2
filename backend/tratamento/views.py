from rest_framework import generics, permissions, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import EventoAgenda, FaseTratamento, ConviteCopiloto, Diario, Medicacao, UserProfile
from .serializers import (
    EventoAgendaSerializer, FaseTratamentoSerializer, ConviteCopilotoSerializer,
    DiarioSerializer, MedicacaoSerializer, UserDetailSerializer, UserUpdateSerializer,
    ProfileUpdateSerializer
)
from django.contrib.auth.models import User


class FaseTratamentoList(generics.ListAPIView):
    queryset = FaseTratamento.objects.all()
    serializer_class = FaseTratamentoSerializer


class UserProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    """
    Obter e atualizar dados do perfil do usuário autenticado.
    GET: Retorna dados do usuário e perfil
    PATCH: Atualiza dados do usuário e/ou perfil
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserDetailSerializer
    
    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'PUT']:
            return UserUpdateSerializer
        return UserDetailSerializer
    
    def update(self, request, *args, **kwargs):
        """Sobrescrever update para lidar com dados do usuário e perfil"""
        user = self.get_object()
        
        # Atualizar campos do User
        user_serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Atualizar campos do UserProfile
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile_data = {k: v for k, v in request.data.items() 
                       if k in ['foto_perfil', 'telefone', 'data_nascimento', 'cidade', 
                               'medica_responsavel', 'protocolo', 'data_inicio_tratamento']}
        
        if profile_data:
            profile_serializer = ProfileUpdateSerializer(profile, data=profile_data, partial=True)
            if profile_serializer.is_valid():
                profile_serializer.save()
            else:
                return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Retornar dados atualizados
        return Response(UserDetailSerializer(user).data)


class UserProfilePhotoUpdateAPIView(APIView):
    """Atualizar apenas a foto de perfil do usuário"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def patch(self, request):
        user = request.user
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        if 'foto_perfil' not in request.FILES:
            return Response(
                {'detail': 'Nenhuma imagem foi enviada.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ProfileUpdateSerializer(
            profile,
            data={'foto_perfil': request.FILES['foto_perfil']},
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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

class MedicacaoListCreate(generics.ListCreateAPIView):
    queryset = Medicacao.objects.all()
    serializer_class = MedicacaoSerializer

class MedicacaoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Medicacao.objects.all()
    serializer_class = MedicacaoSerializer