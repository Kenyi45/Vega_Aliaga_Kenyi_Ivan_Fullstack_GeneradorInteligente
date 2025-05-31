#!/usr/bin/env python3
"""
Script de configuración automática para el Generador Inteligente de Informes Empresariales
Ejecutar con: python setup.py
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def run_command(command, description=""):
    """Ejecuta un comando y maneja errores"""
    print(f"📦 {description}")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} - Completado")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error en {description}: {e}")
        print(f"Output: {e.output}")
        return False

def check_python_version():
    """Verifica la versión de Python"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Se requiere Python 3.8 o superior")
        sys.exit(1)
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} detectado")

def create_env_file():
    """Crea archivo .env si no existe"""
    env_file = Path('.env')
    if not env_file.exists():
        shutil.copy('env_example.txt', '.env')
        print("✅ Archivo .env creado desde env_example.txt")
        print("📝 Recuerda editar el archivo .env con tus configuraciones")
    else:
        print("ℹ️ Archivo .env ya existe")

def setup_virtual_environment():
    """Configura el entorno virtual"""
    venv_path = Path('venv')
    if not venv_path.exists():
        if run_command('python -m venv venv', "Creando entorno virtual"):
            print("✅ Entorno virtual creado en ./venv")
        else:
            return False
    else:
        print("ℹ️ Entorno virtual ya existe")
    
    # Activar entorno virtual y instalar dependencias
    if os.name == 'nt':  # Windows
        activate_script = 'venv\\Scripts\\activate'
        pip_command = 'venv\\Scripts\\pip'
    else:  # Linux/Mac
        activate_script = 'source venv/bin/activate'
        pip_command = 'venv/bin/pip'
    
    return run_command(f'{pip_command} install -r requirements.txt', "Instalando dependencias")

def setup_database():
    """Configura la base de datos"""
    print("\n🗃️ Configuración de Base de Datos")
    print("Asegúrate de que PostgreSQL esté instalado y ejecutándose")
    print("Y que hayas creado la base de datos especificada en tu archivo .env")
    
    # Ejecutar migraciones
    if os.name == 'nt':  # Windows
        python_cmd = 'venv\\Scripts\\python'
    else:  # Linux/Mac
        python_cmd = 'venv/bin/python'
    
    if run_command(f'{python_cmd} manage.py makemigrations', "Creando migraciones"):
        run_command(f'{python_cmd} manage.py migrate', "Aplicando migraciones")
        return True
    return False

def create_superuser():
    """Opcionalmente crea un superusuario"""
    response = input("\n¿Deseas crear un superusuario? (y/n): ").lower().strip()
    if response == 'y':
        if os.name == 'nt':  # Windows
            python_cmd = 'venv\\Scripts\\python'
        else:  # Linux/Mac
            python_cmd = 'venv/bin/python'
        
        os.system(f'{python_cmd} manage.py createsuperuser')

def main():
    """Función principal de configuración"""
    print("🚀 Configurador Automático - Generador Inteligente de Informes Empresariales")
    print("=" * 70)
    
    # 1. Verificar Python
    check_python_version()
    
    # 2. Crear archivo .env
    create_env_file()
    
    # 3. Configurar entorno virtual
    if not setup_virtual_environment():
        print("❌ Error configurando entorno virtual")
        sys.exit(1)
    
    # 4. Configurar base de datos
    setup_database()
    
    # 5. Crear superusuario opcional
    create_superuser()
    
    print("\n" + "=" * 70)
    print("🎉 ¡Configuración completada!")
    print("\nPasos siguientes:")
    print("1. Edita el archivo .env con tus configuraciones de base de datos")
    print("2. Asegúrate de que PostgreSQL esté ejecutándose")
    print("3. Ejecuta el servidor con:")
    
    if os.name == 'nt':  # Windows
        print("   venv\\Scripts\\python manage.py runserver")
    else:  # Linux/Mac
        print("   source venv/bin/activate")
        print("   python manage.py runserver")
    
    print("\n4. Visita http://localhost:8000 para verificar que funciona")
    print("5. La documentación completa está en README.md")

if __name__ == "__main__":
    main() 