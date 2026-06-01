from django.urls import path
from .views import RegisterView, LoginView, RefreshView, UserProfileView, AdminUserListView, AdminUserCreateView, AdminUserDetailView

urlpatterns = [
    #autenticacion
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('refresh/', RefreshView.as_view(), name='token_refresh'),
    path('me/', UserProfileView.as_view(), name='user_profile'), #sirve para devolver quien iniciò sesion
    
    #gestion de usuarios por parte del admin
    path('usuarios/', AdminUserListView.as_view(), name='admin_user_list'),
    path('usuarios/create/', AdminUserCreateView.as_view(), name='admin_user_create'),
    path('usuarios/<int:pk>/', AdminUserDetailView.as_view(), name='admin_user_detail'),
]