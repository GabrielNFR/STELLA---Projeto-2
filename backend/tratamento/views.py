from django.shortcuts import render

from rest_framework import generics
from .models import FaseTratamento
from .serializers import FaseTratamentoSerializer

class FaseTratamentoList(generics.ListAPIView):
    queryset = FaseTratamento.objects.all()
    
    serializer_class = FaseTratamentoSerializer
