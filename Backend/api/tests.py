from rest_framework.test import APITestCase
from rest_framework import status
from .models import Rubro

class RubroPruebas(APITestCase):
    def test_crear_rubro(self):
        """Verifica que se puede crear un rubro y devuelve 201"""
        url = '/api/rubros/'
        data = {'nombre': 'Papelería'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Rubro.objects.count(), 1)
        self.assertEqual(Rubro.objects.get().nombre, 'Papelería')

    def test_obtener_rubros(self):
        """Verifica que la lista de rubros devuelve 200"""
        url = '/api/rubros/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
