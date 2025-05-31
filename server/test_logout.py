#!/usr/bin/env python3
"""
Script de prueba para la API de logout
"""

import requests
import json

# Configuración
BASE_URL = "http://localhost:8000"
AUTH_URL = f"{BASE_URL}/api/auth"

def test_logout_api():
    """
    Prueba completa del flujo de autenticación con logout
    """
    print("🔐 Probando API de Logout")
    print("=" * 50)
    
    # Datos de prueba
    test_user = {
        "email": "test_logout@example.com",
        "username": "test_logout",
        "first_name": "Test",
        "last_name": "Logout",
        "company": "Test Company",
        "position": "Developer",
        "password": "TestPassword123!",
        "password_confirm": "TestPassword123!"
    }
    
    try:
        # 1. Registro de usuario (opcional, si no existe)
        print("📝 1. Intentando registrar usuario de prueba...")
        register_response = requests.post(
            f"{AUTH_URL}/register/",
            json=test_user,
            headers={"Content-Type": "application/json"}
        )
        
        if register_response.status_code == 201:
            print("✅ Usuario registrado exitosamente")
            data = register_response.json()
            access_token = data['access']
            refresh_token = data['refresh']
        elif register_response.status_code == 400:
            print("ℹ️  Usuario ya existe, procediendo con login...")
            
            # 2. Login
            print("🔑 2. Realizando login...")
            login_response = requests.post(
                f"{AUTH_URL}/login/",
                json={
                    "email": test_user["email"],
                    "password": test_user["password"]
                },
                headers={"Content-Type": "application/json"}
            )
            
            if login_response.status_code == 200:
                print("✅ Login exitoso")
                data = login_response.json()
                access_token = data['access']
                refresh_token = data['refresh']
            else:
                print(f"❌ Error en login: {login_response.status_code}")
                print(login_response.text)
                return
        else:
            print(f"❌ Error en registro: {register_response.status_code}")
            print(register_response.text)
            return
        
        # 3. Verificar que estamos autenticados
        print("🔍 3. Verificando autenticación...")
        user_info_response = requests.get(
            f"{AUTH_URL}/user-info/",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        if user_info_response.status_code == 200:
            print("✅ Usuario autenticado correctamente")
            user_data = user_info_response.json()
            print(f"   Usuario: {user_data['email']}")
        else:
            print(f"❌ Error al verificar autenticación: {user_info_response.status_code}")
            return
        
        # 4. Realizar logout
        print("🚪 4. Realizando logout...")
        logout_response = requests.post(
            f"{AUTH_URL}/logout/",
            json={"refresh_token": refresh_token},
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
        )
        
        if logout_response.status_code == 200:
            print("✅ Logout exitoso")
            logout_data = logout_response.json()
            print(f"   Mensaje: {logout_data['message']}")
        else:
            print(f"❌ Error en logout: {logout_response.status_code}")
            print(logout_response.text)
            return
        
        # 5. Verificar que el token ya no funciona
        print("🔒 5. Verificando que el refresh token fue invalidado...")
        try_refresh_response = requests.post(
            f"{AUTH_URL}/token/refresh/",
            json={"refresh": refresh_token},
            headers={"Content-Type": "application/json"}
        )
        
        if try_refresh_response.status_code == 401:
            print("✅ Token refresh invalidado correctamente")
        else:
            print(f"⚠️  Resultado inesperado: {try_refresh_response.status_code}")
            print(try_refresh_response.text)
        
        print("\n🎉 ¡Prueba de logout completada exitosamente!")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión: {e}")
        print("Asegúrate de que el servidor Django esté ejecutándose en http://localhost:8000")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

if __name__ == "__main__":
    test_logout_api() 