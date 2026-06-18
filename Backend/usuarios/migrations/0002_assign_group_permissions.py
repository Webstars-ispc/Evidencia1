from django.db import migrations

def assign_permissions(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Permission = apps.get_model('auth', 'Permission')

    empleado, _ = Group.objects.get_or_create(name='Empleado')
    admin, _ = Group.objects.get_or_create(name='Administrador')

    productos_perms = Permission.objects.filter(
        content_type__app_label='api',
        content_type__model__in=['producto', 'rubro', 'marca']
    )

    empleado.permissions.set(productos_perms)
    admin.permissions.set(Permission.objects.all())

def remove_permissions(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    for g in Group.objects.all():
        g.permissions.clear()

class Migration(migrations.Migration):

    dependencies = [
        ('auth', '__first__'),
        ('usuarios', '0001_create_groups'),
    ]

    operations = [
        migrations.RunPython(assign_permissions, reverse_code=remove_permissions),
    ]
