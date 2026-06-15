from django.apps import AppConfig


class TratamentoConfig(AppConfig):
    name = 'tratamento'
    
    def ready(self):
        import tratamento.signals
