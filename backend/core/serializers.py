from rest_framework import serializers
from .models import Rol, Usuario, HistorialIA, ChatSession
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    rol = RolSerializer(read_only=True)
    rol_id = serializers.PrimaryKeyRelatedField(
        queryset=Rol.objects.all(), source='rol', write_only=True, required=False
    )
    
    class Meta:
        model = Usuario
        fields = ('id', 'correo', 'nombre_usuario', 'rol', 'rol_id', 'fecha_registro', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = super().create(validated_data) # Usar super().create() para manejar otros campos
        if password:
            instance.set_password(password)
            instance.save()
        return instance

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

# TareaSerializer removed

class ChatSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSession
        fields = '__all__'
        read_only_fields = ('usuario', 'fecha_creacion')

class HistorialIASerializer(serializers.ModelSerializer):
    nombre_usuario = serializers.ReadOnlyField(source='usuario.nombre_usuario')
    class Meta:
        model = HistorialIA
        fields = ('id_historial', 'prompt', 'imagen_generada', 'fecha_generacion', 'usuario', 'nombre_usuario', 'chat')
        read_only_fields = ('fecha_generacion', 'imagen_generada', 'usuario')

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['nombre_usuario'] = user.nombre_usuario
        token['rol'] = user.rol.rol if user.rol else None
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['nombre_usuario'] = self.user.nombre_usuario
        data['rol'] = self.user.rol.rol if self.user.rol else None
        return data
