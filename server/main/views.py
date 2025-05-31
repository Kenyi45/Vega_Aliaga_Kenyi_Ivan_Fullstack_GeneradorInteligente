from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """
    Endpoint raíz de la API que proporciona información básica
    """
    return Response({
        'message': 'Bienvenido al Generador Inteligente de Informes Empresariales',
        'version': '1.0.0',
        'endpoints': {
            'authentication': {
                'register': '/api/auth/register/',
                'login': '/api/auth/login/',
                'profile': '/api/auth/profile/',
                'refresh_token': '/api/auth/token/refresh/'
            },
            'reports': {
                'upload_csv': '/api/upload/',
                'dashboard': '/api/dashboard/',
                'reports': '/api/reports/',
                'csv_files': '/api/csv-files/'
            }
        }
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Endpoint para verificar el estado de la API
    """
    return Response({
        'status': 'healthy',
        'message': 'API funcionando correctamente'
    }, status=status.HTTP_200_OK)
