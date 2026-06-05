from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Simple login using Django's AUTH_USER_MODEL.

    Expects JSON:
      - email (or username)
      - password

    Returns:
      - ok: true/false
      - user: {id, email, rol} when ok
    """

    email = request.data.get('email') or request.data.get('username')
    password = request.data.get('password')

    if not email or not password:
        return Response({'ok': False, 'error': 'email and password are required'}, status=400)

    user = authenticate(request, username=email, password=password)
    if user is None:
        return Response({'ok': False, 'error': 'invalid credentials'}, status=401)

    # Authenticate() should already validate password via USERNAME_FIELD=email.
    return Response(
        {
            'ok': True,
            'user': {
                'id': getattr(user, 'usuario_id', None) or user.pk,
                'email': user.email,
                'rol': getattr(getattr(user, 'rol', None), 'rol', None),
            }
        }
    )

