from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token


class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '')

        if not email or not password:
            return Response(
                {'detail': 'Informe e-mail e senha.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(email__iexact=email).first()
        if user is None:
            return Response(
                {'detail': 'E-mail ou senha inválidos.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        authenticated_user = authenticate(
            request,
            username=user.username,
            password=password,
        )

        if authenticated_user is None:
            return Response(
                {'detail': 'E-mail ou senha inválidos.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not authenticated_user.is_active:
            return Response(
                {'detail': 'Usuário inativo.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        token, _ = Token.objects.get_or_create(user=authenticated_user)

        return Response({
            'token': token.key,
            'user': {
                'id': authenticated_user.id,
                'username': authenticated_user.username,
                'email': authenticated_user.email,
                'first_name': authenticated_user.first_name,
                'last_name': authenticated_user.last_name,
            },
        })
