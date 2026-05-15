from django.urls import path
from .views import FaseTratamentoList

urlpatterns = [
    path('fases/', FaseTratamentoList.as_view(), name='lista-fases'),
]