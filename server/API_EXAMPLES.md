# Ejemplos de Uso de la API

Este documento contiene ejemplos prácticos para interactuar con la API del Generador Inteligente de Informes Empresariales.

## Configuración Inicial

Base URL: `http://localhost:8000`

## 1. Autenticación

### Registro de Usuario

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@empresa.com",
    "username": "usuario_test",
    "first_name": "Juan",
    "last_name": "Pérez",
    "company": "Mi Empresa SA",
    "position": "Analista de Datos",
    "password": "MiPassword123!",
    "password_confirm": "MiPassword123!"
  }'
```

Respuesta:
```json
{
  "message": "Usuario registrado exitosamente",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "usuario@empresa.com",
    "username": "usuario_test",
    "first_name": "Juan",
    "last_name": "Pérez",
    "company": "Mi Empresa SA",
    "position": "Analista de Datos",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

### Login de Usuario

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@empresa.com",
    "password": "MiPassword123!"
  }'
```

### Cerrar Sesión (Logout)

```bash
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [tu_access_token]" \
  -d '{
    "refresh_token": "[tu_refresh_token]"
  }'
```

Respuesta exitosa:
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

Respuesta de error (token inválido):
```json
{
  "error": "Token inválido"
}
```

### Obtener Información del Usuario

```bash
curl -X GET http://localhost:8000/api/auth/user-info/ \
  -H "Authorization: Bearer [tu_access_token]"
```

## 2. Gestión de Archivos CSV

### Subir Archivo CSV

```bash
curl -X POST http://localhost:8000/api/upload/ \
  -H "Authorization: Bearer [tu_access_token]" \
  -F "file=@sample_data.csv"
```

Respuesta:
```json
{
  "message": "Archivo subido y procesado exitosamente",
  "csv_file": {
    "id": 1,
    "original_name": "sample_data.csv",
    "status": "completed",
    "created_at": "2025-01-15T10:35:00Z",
    "updated_at": "2025-01-15T10:35:30Z"
  },
  "report_id": 1
}
```

### Listar Archivos CSV del Usuario

```bash
curl -X GET http://localhost:8000/api/csv-files/ \
  -H "Authorization: Bearer [tu_access_token]"
```

### Eliminar Archivo CSV

```bash
curl -X DELETE http://localhost:8000/api/csv-files/1/delete/ \
  -H "Authorization: Bearer [tu_access_token]"
```

## 3. Informes y Análisis

### Obtener Dashboard Resumen

```bash
curl -X GET http://localhost:8000/api/dashboard/ \
  -H "Authorization: Bearer [tu_access_token]"
```

Respuesta:
```json
{
  "statistics": {
    "total_files": 3,
    "total_reports": 3,
    "completed_files": 3,
    "processing_files": 0,
    "error_files": 0,
    "total_sales": 25847.89,
    "total_records": 120
  },
  "recent_reports": [
    {
      "id": 1,
      "csv_file": {
        "id": 1,
        "original_name": "ventas_enero.csv",
        "status": "completed",
        "created_at": "2025-01-15T10:35:00Z",
        "updated_at": "2025-01-15T10:35:30Z"
      },
      "total_sales": "8547.89",
      "total_records": 40,
      "date_range_start": "2024-01-01",
      "date_range_end": "2024-01-31",
      "created_at": "2025-01-15T10:35:30Z"
    }
  ]
}
```

### Listar Todos los Informes

```bash
curl -X GET http://localhost:8000/api/reports/ \
  -H "Authorization: Bearer [tu_access_token]"
```

### Obtener Detalle de un Informe

```bash
curl -X GET http://localhost:8000/api/reports/1/ \
  -H "Authorization: Bearer [tu_access_token]"
```

Respuesta:
```json
{
  "id": 1,
  "csv_file": {
    "id": 1,
    "original_name": "sample_data.csv",
    "status": "completed",
    "created_at": "2025-01-15T10:35:00Z",
    "updated_at": "2025-01-15T10:35:30Z"
  },
  "total_sales": "25847.89",
  "total_records": 40,
  "date_range_start": "2024-01-15",
  "date_range_end": "2024-04-10",
  "top_products": {
    "labels": ["Laptop MacBook", "Laptop Gaming", "Laptop HP", "Laptop ASUS", "Laptop Dell"],
    "data": [1999.00, 1850.00, 2400.00, 1250.00, 1350.00]
  },
  "sales_by_region": {
    "labels": ["Norte", "Centro", "Este", "Sur"],
    "data": [8547.89, 6234.56, 5678.90, 5386.54]
  },
  "sales_by_date": {
    "labels": ["2024-01", "2024-02", "2024-03", "2024-04"],
    "data": [5843.48, 6334.98, 7859.44, 5809.99]
  },
  "monthly_trends": [
    {
      "month": "2024-01",
      "sales": 5843.48,
      "growth": 0
    },
    {
      "month": "2024-02",
      "sales": 6334.98,
      "growth": 8.41
    },
    {
      "month": "2024-03",
      "sales": 7859.44,
      "growth": 24.07
    },
    {
      "month": "2024-04",
      "sales": 5809.99,
      "growth": -26.08
    }
  ],
  "auto_insights": "Las ventas totales ascienden a $25,847.89 con 40 registros.\nEl producto más vendido es 'Laptop HP' con ventas de $2,400.00.\nAtención: Las ventas disminuyeron 26.1% en 2024-04.\nEl portafolio incluye 10 productos diferentes en el top 10.\nLas operaciones abarcan 4 regiones, siendo 'Norte' la más exitosa.",
  "created_at": "2025-01-15T10:35:30Z",
  "updated_at": "2025-01-15T10:35:30Z",
  "sales_data_sample": [
    {
      "id": 1,
      "date": "2024-01-15",
      "product": "Laptop HP",
      "category": "Electrónicos",
      "region": "Norte",
      "sales_amount": "1200.00",
      "quantity": 1,
      "additional_data": {}
    }
  ],
  "pdf_url": null
}
```

## 4. Generación y Descarga de PDF

### Generar PDF para un Informe

```bash
curl -X POST http://localhost:8000/api/reports/1/generate-pdf/ \
  -H "Authorization: Bearer [tu_access_token]"
```

Respuesta:
```json
{
  "message": "PDF generado exitosamente",
  "pdf_url": "http://localhost:8000/media/reports/pdf/informe_sample_data.csv_20250115_103545.pdf"
}
```

### Descargar PDF

```bash
curl -X GET http://localhost:8000/api/reports/1/download-pdf/ \
  -H "Authorization: Bearer [tu_access_token]" \
  -o "informe.pdf"
```

## 5. Gestión de Tokens

### Refrescar Token de Acceso

```bash
curl -X POST http://localhost:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "[tu_refresh_token]"
  }'
```

## 6. Endpoints de Información

### Información de la API

```bash
curl -X GET http://localhost:8000/api/
```

### Health Check

```bash
curl -X GET http://localhost:8000/api/health/
```

## Ejemplos con JavaScript (Frontend)

### Configuración Base

```javascript
const API_BASE_URL = 'http://localhost:8000';
let accessToken = localStorage.getItem('access_token');

// Headers por defecto
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken}`
});
```

### Login

```javascript
async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      accessToken = data.access;
      return data;
    } else {
      throw new Error(data.error || 'Error en login');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Subir Archivo CSV

```javascript
async function uploadCSV(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/api/upload/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` },
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || 'Error subiendo archivo');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Obtener Dashboard

```javascript
async function getDashboard() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/`, {
      headers: getHeaders()
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || 'Error obteniendo dashboard');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Obtener Detalle de Informe

```javascript
async function getReportDetail(reportId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}/`, {
      headers: getHeaders()
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || 'Error obteniendo informe');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

## Ejemplos con Python (Cliente)

```python
import requests
import json

class APIClient:
    def __init__(self, base_url='http://localhost:8000'):
        self.base_url = base_url
        self.access_token = None
        
    def login(self, email, password):
        """Login y obtener token"""
        response = requests.post(
            f'{self.base_url}/api/auth/login/',
            json={'email': email, 'password': password}
        )
        
        if response.status_code == 200:
            data = response.json()
            self.access_token = data['access']
            return data
        else:
            raise Exception(f"Error en login: {response.text}")
    
    def get_headers(self):
        """Headers con autorización"""
        return {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }
    
    def upload_csv(self, file_path):
        """Subir archivo CSV"""
        with open(file_path, 'rb') as f:
            files = {'file': f}
            headers = {'Authorization': f'Bearer {self.access_token}'}
            
            response = requests.post(
                f'{self.base_url}/api/upload/',
                files=files,
                headers=headers
            )
            
        if response.status_code == 201:
            return response.json()
        else:
            raise Exception(f"Error subiendo archivo: {response.text}")
    
    def get_dashboard(self):
        """Obtener datos del dashboard"""
        response = requests.get(
            f'{self.base_url}/api/dashboard/',
            headers=self.get_headers()
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Error obteniendo dashboard: {response.text}")

# Uso del cliente
client = APIClient()
client.login('usuario@empresa.com', 'MiPassword123!')
dashboard_data = client.get_dashboard()
print(json.dumps(dashboard_data, indent=2))
```

## Códigos de Estado HTTP

- `200 OK`: Solicitud exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Error en la solicitud (validación)
- `401 Unauthorized`: Token inválido o faltante
- `403 Forbidden`: Sin permisos para el recurso
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

## Consideraciones Importantes

1. **Tokens JWT**: Los tokens de acceso expiran en 60 minutos
2. **Refresh Tokens**: Usar para obtener nuevos tokens de acceso
3. **Archivos CSV**: Máximo 50MB por archivo
4. **Rate Limiting**: No implementado en desarrollo (considerar para producción)
5. **CORS**: Configurado para localhost:5173 (frontend React) 