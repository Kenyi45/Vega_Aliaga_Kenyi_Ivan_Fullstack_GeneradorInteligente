#!/usr/bin/env python
"""
Script para limpiar migraciones inconsistentes
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.db import connection
from django.core.management import execute_from_command_line

def clean_migrations():
    """Limpiar migraciones inconsistentes"""
    print("🧹 Limpiando migraciones inconsistentes...")
    
    with connection.cursor() as cursor:
        # Ver el estado actual
        cursor.execute("SELECT app, name FROM django_migrations ORDER BY applied;")
        current_migrations = cursor.fetchall()
        print(f"📋 Migraciones actuales: {len(current_migrations)}")
        for app, name in current_migrations:
            print(f"  - {app}.{name}")
        
        # Eliminar migraciones problemáticas
        print("\n🗑️  Eliminando migraciones problemáticas...")
        cursor.execute("""
            DELETE FROM django_migrations 
            WHERE app IN ('admin', 'auth', 'authentication', 'reports', 'sessions', 'main');
        """)
        
        # Verificar limpieza
        cursor.execute("SELECT COUNT(*) FROM django_migrations;")
        count = cursor.fetchone()[0]
        print(f"✅ Migraciones restantes: {count}")
        
    print("\n🔄 Aplicando migraciones desde cero...")
    
    # Marcar como fake para evitar conflictos
    os.system("python manage.py migrate --fake-initial")
    
    print("✅ ¡Migraciones limpiadas! Ahora ejecuta:")
    print("   python manage.py makemigrations authentication")
    print("   python manage.py makemigrations reports")
    print("   python manage.py migrate")

if __name__ == "__main__":
    clean_migrations() 