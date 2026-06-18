from datetime import date, time

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import ConviteCopiloto, Diario, EventoAgenda, FaseTratamento, Medicacao


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


class LoginAPITests(APITestCase):
    def setUp(self):
        self.url = reverse('auth-login')
        self.user = User.objects.create_user(
            username='joana',
            email='joana@email.com',
            password='senha123',
            first_name='Joana',
            last_name='Lima',
        )

    def test_login_com_credenciais_validas(self):
        resposta = self.client.post(self.url, {
            'email': 'joana@email.com',
            'password': 'senha123',
        }, format='json')

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertIn('token', resposta.data)
        self.assertEqual(resposta.data['user']['email'], 'joana@email.com')

    def test_login_senha_incorreta(self):
        resposta = self.client.post(self.url, {
            'email': 'joana@email.com',
            'password': 'senhaerrada',
        }, format='json')

        self.assertEqual(resposta.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('token', resposta.data)

    def test_login_email_nao_cadastrado(self):
        resposta = self.client.post(self.url, {
            'email': 'naoexiste@email.com',
            'password': 'qualquersenha',
        }, format='json')

        self.assertEqual(resposta.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_sem_campos_retorna_400(self):
        resposta = self.client.post(self.url, {}, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_retorna_dados_do_usuario(self):
        resposta = self.client.post(self.url, {
            'email': 'joana@email.com',
            'password': 'senha123',
        }, format='json')

        usuario = resposta.data['user']
        self.assertEqual(usuario['first_name'], 'Joana')
        self.assertEqual(usuario['last_name'], 'Lima')
        self.assertIn('id', usuario)


class DiarioAPITests(APITestCase):
    def setUp(self):
        self.paciente = User.objects.create_user(
            username='luisa',
            email='luisa@email.com',
            password='senha123',
        )
        self.outro_usuario = User.objects.create_user(
            username='pedro',
            email='pedro@email.com',
            password='senha456',
        )
        self.token, _ = Token.objects.get_or_create(user=self.paciente)
        self.url = reverse('diario-list-create')

    def test_criar_checkin_com_humor(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        resposta = self.client.post(self.url, {
            'humor': 'bem',
            'sintomas': ['enjoo leve'],
            'notas': 'Dormiu bem, pouco cansada hoje.',
        }, format='json')

        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Diario.objects.count(), 1)
        self.assertEqual(Diario.objects.get().paciente, self.paciente)

    def test_checkin_sem_autenticacao_retorna_401(self):
        resposta = self.client.post(self.url, {'humor': 'bem'}, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_checkin_sem_humor_retorna_400(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        resposta = self.client.post(self.url, {
            'humor': '',
            'sintomas': [],
        }, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)

    def test_usuario_so_ve_proprios_registros(self):
        Diario.objects.create(paciente=self.paciente, humor='cansada')
        Diario.objects.create(paciente=self.outro_usuario, humor='bem')

        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        resposta = self.client.get(self.url)

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resposta.data), 1)
        self.assertEqual(resposta.data[0]['humor'], 'cansada')

    def test_checkin_com_multiplos_sintomas(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        sintomas = ['inchaço', 'sensibilidade nos seios', 'cólica leve']
        resposta = self.client.post(self.url, {
            'humor': 'regular',
            'sintomas': sintomas,
            'condicoes_fisiologicas': ['temperatura 36.8'],
        }, format='json')

        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resposta.data['sintomas'], sintomas)


class MedicacaoAPITests(APITestCase):
    def setUp(self):
        self.url = reverse('medicacoes-list')
        self.payload_progesterona = {
            'nome': 'Progesterona',
            'dose': '200mg',
            'data_inicio': '2026-06-01',
            'data_fim': '2026-07-15',
            'horarios': ['08:00', '20:00'],
        }

    def test_cadastrar_medicacao(self):
        resposta = self.client.post(self.url, self.payload_progesterona, format='json')

        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Medicacao.objects.count(), 1)
        self.assertEqual(Medicacao.objects.get().nome, 'Progesterona')

    def test_medicacao_sem_nome_retorna_400(self):
        payload = {**self.payload_progesterona, 'nome': ''}
        resposta = self.client.post(self.url, payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)

    def test_listar_medicacoes(self):
        Medicacao.objects.create(
            nome='Estradiol',
            dose='2mg',
            data_inicio=date(2026, 5, 1),
            horarios=['07:00'],
        )
        Medicacao.objects.create(
            nome='Progesterona',
            dose='200mg',
            data_inicio=date(2026, 5, 15),
            horarios=['08:00', '20:00'],
        )

        resposta = self.client.get(self.url)
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resposta.data), 2)

    def test_deletar_medicacao(self):
        med = Medicacao.objects.create(
            nome='Utrogestan',
            dose='100mg',
            data_inicio=date(2026, 6, 1),
            horarios=['12:00'],
        )
        url_detalhe = reverse('medicacoes-detail', args=[med.pk])
        resposta = self.client.delete(url_detalhe)

        self.assertEqual(resposta.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Medicacao.objects.count(), 0)

    def test_atualizar_dose_medicacao(self):
        med = Medicacao.objects.create(
            nome='Gonal-F',
            dose='75 UI',
            data_inicio=date(2026, 6, 1),
            horarios=['22:00'],
        )
        url_detalhe = reverse('medicacoes-detail', args=[med.pk])
        resposta = self.client.patch(url_detalhe, {'dose': '150 UI'}, format='json')

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        med.refresh_from_db()
        self.assertEqual(med.dose, '150 UI')

    def test_medicacao_sem_data_inicio_retorna_400(self):
        payload = {k: v for k, v in self.payload_progesterona.items() if k != 'data_inicio'}
        resposta = self.client.post(self.url, payload, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)


class FaseTratamentoAPITests(APITestCase):
    def setUp(self):
        FaseTratamento.objects.create(nome='Estimulação Ovariana', ordem_cronologica=1, status='concluida')
        FaseTratamento.objects.create(nome='Punção Folicular', ordem_cronologica=2, status='concluida')
        FaseTratamento.objects.create(nome='Fecundação', ordem_cronologica=3, status='atual')
        FaseTratamento.objects.create(nome='Transferência Embrionária', ordem_cronologica=4, status='pendente')
        FaseTratamento.objects.create(nome='Resultado Beta-HCG', ordem_cronologica=5, status='pendente')

    def test_lista_fases_em_ordem_cronologica(self):
        resposta = self.client.get(reverse('lista-fases'))
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        ordens = [f['ordem_cronologica'] for f in resposta.data]
        self.assertEqual(ordens, sorted(ordens))

    def test_retorna_todas_as_fases(self):
        resposta = self.client.get(reverse('lista-fases'))
        self.assertEqual(len(resposta.data), 5)

    def test_fases_tem_campos_esperados(self):
        resposta = self.client.get(reverse('lista-fases'))
        fase = resposta.data[0]
        for campo in ('id', 'nome', 'ordem_cronologica', 'status'):
            self.assertIn(campo, fase)

    def test_fase_atual_esta_no_meio(self):
        resposta = self.client.get(reverse('lista-fases'))
        fases = resposta.data
        fase_atual = next(f for f in fases if f['status'] == 'atual')
        self.assertEqual(fase_atual['nome'], 'Fecundação')


class PerfilAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='paula',
            email='paula@email.com',
            password='senha789',
            first_name='Paula',
            last_name='Souza',
        )
        self.token, _ = Token.objects.get_or_create(user=self.user)
        self.url = reverse('user-profile')

    def test_obter_perfil_autenticado(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        resposta = self.client.get(self.url)

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(resposta.data['email'], 'paula@email.com')
        self.assertEqual(resposta.data['first_name'], 'Paula')

    def test_perfil_sem_autenticacao_retorna_401(self):
        resposta = self.client.get(self.url)
        self.assertEqual(resposta.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_atualizar_sobrenome_e_medica(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        resposta = self.client.patch(self.url, {
            'last_name': 'Souza Nunes',
            'medica_responsavel': 'Dra. Renata',
        }, format='json')

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.last_name, 'Souza Nunes')

    def test_perfil_contem_dados_do_profile(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        resposta = self.client.get(self.url)

        self.assertIn('profile', resposta.data)


class CopilotoAPITests(APITestCase):
    def setUp(self):
        self.paciente = User.objects.create_user(
            username='lucia',
            email='lucia@email.com',
            password='senha123',
        )
        self.url = reverse('copiloto-convidar')

    def test_criar_convite_com_nome(self):
        resposta = self.client.post(self.url, {
            'nome_identificador': 'Marido',
        }, format='json')

        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ConviteCopiloto.objects.count(), 1)
        self.assertIn('token', resposta.data)

    def test_convite_gera_token_unico(self):
        self.client.post(self.url, {'nome_identificador': 'Marido'}, format='json')
        self.client.post(self.url, {'nome_identificador': 'Minha Mãe'}, format='json')

        tokens = list(ConviteCopiloto.objects.values_list('token', flat=True))
        self.assertEqual(len(tokens), len(set(tokens)))

    def test_convite_sem_nome_retorna_400(self):
        resposta = self.client.post(self.url, {'nome_identificador': ''}, format='json')
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ConviteCopiloto.objects.count(), 0)

    def test_convite_criado_com_status_pendente(self):
        resposta = self.client.post(self.url, {'nome_identificador': 'Irmã'}, format='json')

        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resposta.data['status'], 'pendente')

    def test_permissoes_padrao_do_convite(self):
        resposta = self.client.post(self.url, {'nome_identificador': 'Marido'}, format='json')

        self.assertTrue(resposta.data['perm_ver_fase'])
        self.assertTrue(resposta.data['perm_ver_agenda'])
        self.assertTrue(resposta.data['perm_ver_medicacoes'])
