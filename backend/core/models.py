from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class Rol(models.Model):
    id_rol = models.AutoField(primary_key=True)
    rol = models.CharField(max_length=50)
    permiso = models.CharField(max_length=50)

    def __str__(self):
        return self.rol

class UsuarioManager(BaseUserManager):
    def create_user(self, correo, nombre_usuario, password=None, **extra_fields):
        if not correo:
            raise ValueError('El correo es obligatorio')
        correo = self.normalize_email(correo)
        user = self.model(correo=correo, nombre_usuario=nombre_usuario, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, correo, nombre_usuario, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(correo, nombre_usuario, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    correo = models.EmailField(unique=True)
    nombre_usuario = models.CharField(max_length=100)
    rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombre_usuario']

    def __str__(self):
        return self.correo

# Tarea model removed (AI-Only Specialization)

class ChatSession(models.Model):
    id_chat = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200, default="Nueva Secuencia")
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='chats')
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} - {self.usuario.nombre_usuario}"

class HistorialIA(models.Model):
    id_historial = models.AutoField(primary_key=True)
    prompt = models.TextField()
    imagen_generada = models.URLField(max_length=500)
    fecha_generacion = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='historiales_ia')
    chat = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='mensajes', null=True, blank=True)

    def __str__(self):
        return f"Generación {self.id_historial} - {self.usuario.nombre_usuario}"
