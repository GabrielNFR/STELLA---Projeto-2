from datetime import date, time

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import EventoAgenda


class EventoAgendaAPITests(APITestCase):
    def test_cria_evento_de_agenda_valido(self):
        resposta = self.client.post(
            reverse('agenda-list-create'),
            {
                'titulo': 'Consulta Dra Adriana',
                'tipo': 'consulta',
                'data': '2026-05-22',
                'horario': '14:30',
                'local': 'Clínica AMARE',
                'observacoes': 'Chegar 15 minutos antes.',
            },
            format='json',
        )

        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(EventoAgenda.objects.count(), 1)
        evento = EventoAgenda.objects.get()
        self.assertEqual(evento.titulo, 'Consulta Dra Adriana')
        self.assertEqual(evento.tipo, 'consulta')

    def test_rejeita_evento_sem_campos_obrigatorios(self):
        resposta = self.client.post(
            reverse('agenda-list-create'),
            {
                'titulo': '',
                'tipo': 'exame',
                'data': '2026-05-23',
            },
            format='json',
        )

        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(EventoAgenda.objects.count(), 0)

    def test_lista_eventos_ordenados_por_data_e_horario(self):
        EventoAgenda.objects.create(
            titulo='Exame mais tarde',
            tipo='exame',
            data=date(2026, 5, 22),
            horario=time(15, 0),
        )
        EventoAgenda.objects.create(
            titulo='Consulta cedo',
            tipo='consulta',
            data=date(2026, 5, 22),
            horario=time(8, 0),
        )
        EventoAgenda.objects.create(
            titulo='Exame amanhã',
            tipo='exame',
            data=date(2026, 5, 23),
            horario=time(9, 0),
        )

        resposta = self.client.get(reverse('agenda-list-create'))

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [item['titulo'] for item in resposta.data],
            ['Consulta cedo', 'Exame mais tarde', 'Exame amanhã'],
        )
