from rest_framework import serializers
from .models import FaseTratamento

class FaseTratamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaseTratamento
        fields = '__all__' 