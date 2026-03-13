from rest_framework import viewsets, permissions, views, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
import random
from .models import Rol, Usuario, HistorialIA, ChatSession
from .serializers import (
    RolSerializer, UsuarioSerializer, 
    HistorialIASerializer, ChatSessionSerializer, MyTokenObtainPairSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [permissions.AllowAny]

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # Solo administradores pueden ver la lista completa de usuarios
        if self.request.user.rol and self.request.user.rol.rol == 'administrador':
            return Usuario.objects.all()
        # Usuarios regulares solo pueden verse a sí mismos
        return Usuario.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

# TareaViewSet removed (AI-Only Specialization)

class HistorialIAViewSet(viewsets.ModelViewSet):
    queryset = HistorialIA.objects.all()
    serializer_class = HistorialIASerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtrar por chat si viene el ID en la query
        chat_id = self.request.query_params.get('chat_id')
        user = self.request.user
        
        if user.rol and user.rol.rol == 'administrador':
            qs = HistorialIA.objects.all()
        else:
            qs = HistorialIA.objects.filter(usuario=user)
        
        if chat_id:
            qs = qs.filter(chat_id=chat_id)
        
        return qs.order_by('-fecha_generacion')

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def generar(self, request):
        prompt = request.data.get('prompt')
        chat_id = request.data.get('chat_id')
        
        if not prompt:
            return Response({"error": "El prompt es obligatorio"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar chat o crear uno por defecto si no existe
        if chat_id:
            try:
                chat = ChatSession.objects.get(id_chat=chat_id, usuario=request.user)
            except ChatSession.DoesNotExist:
                return Response({"error": "Chat no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Crear un chat automático si no se especifica uno
            chat = ChatSession.objects.create(
                nombre=prompt[:30] + "...",
                usuario=request.user
            )

        # Simulación de generación de IA
        seed = sum(ord(c) for c in prompt) + random.randint(1, 1000)
        imagen_url = f"https://picsum.photos/seed/{seed}/800/600"
        
        historial = HistorialIA.objects.create(
            prompt=prompt,
            imagen_generada=imagen_url,
            usuario=request.user,
            chat=chat
        )
        
        serializer = self.get_serializer(historial)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ChatSessionViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(usuario=self.request.user).order_by('-fecha_creacion')

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class StatsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        is_admin = request.user.rol and request.user.rol.rol == 'administrador'
        
        if is_admin:
            total_sintesis = HistorialIA.objects.count()
            usuarios_activos = Usuario.objects.filter(is_active=True).count()
            total_sesiones = ChatSession.objects.count()
        else:
            total_sintesis = HistorialIA.objects.filter(usuario=request.user).count()
            usuarios_activos = 1
            total_sesiones = ChatSession.objects.filter(usuario=request.user).count()
        
        # Datos históricos simulados para el gráfico
        historical_data = [
            {"mes": "Ene", "usuarios": round(usuarios_activos * 0.6) if is_admin else 1, "sintesis": round(total_sintesis * 0.5)},
            {"mes": "Feb", "usuarios": round(usuarios_activos * 0.7) if is_admin else 1, "sintesis": round(total_sintesis * 0.6)},
            {"mes": "Mar", "usuarios": round(usuarios_activos * 0.8) if is_admin else 1, "sintesis": round(total_sintesis * 0.8)},
            {"mes": "Abr", "usuarios": usuarios_activos if is_admin else 1, "sintesis": total_sintesis},
        ]

        data = {
            "total_sintesis": total_sintesis, 
            "usuarios_activos": usuarios_activos if is_admin else "N/A",
            "total_sesiones": total_sesiones,
            "historical_data": historical_data,
            "task_distribution": [
                {"name": "Sesiones", "value": total_sesiones, "color": "#10b981"},
                {"name": "Síntesis", "value": total_sintesis, "color": "#f59e0b"},
            ]
        }
        return Response(data)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
