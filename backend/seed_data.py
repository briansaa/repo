from core.models import Rol, Usuario

# Crear roles
admin_role, _ = Rol.objects.get_or_create(rol='administrador', permiso='full_access')
user_role, _ = Rol.objects.get_or_create(rol='usuario', permiso='limited_access')

# Crear superusuario inicial si no existe
if not Usuario.objects.filter(correo='admin@admin.com').exists():
    Usuario.objects.create_superuser(
        correo='admin@admin.com',
        nombre_usuario='Administrador',
        password='admin123',
        rol=admin_role
    )
    print("DONE: Superuser created: admin@admin.com / admin123")
else:
    print("INFO: Superuser already exists.")
