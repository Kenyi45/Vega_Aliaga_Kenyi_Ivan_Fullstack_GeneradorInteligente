# Generador Inteligente de Informes Empresariales - Backend

## Descripción

Backend API REST desarrollado con Django REST Framework para la plataforma "Generador Inteligente de Informes Empresariales". Esta herramienta permite a las empresas transformar archivos CSV de datos de ventas en informes visuales y resúmenes automáticos.

## Características Principales

### 🔐 Autenticación y Autorización
- Sistema de autenticación basado en JWT (JSON Web Tokens)
- Registro y login de usuarios
- Gestión de perfiles de usuario
- Protección de endpoints con tokens

### 📊 Análisis de Datos
- Procesamiento automático de archivos CSV
- Análisis de datos de ventas con Pandas
- Generación de métricas clave:
  - Ventas totales
  - Top productos más vendidos
  - Ventas por región
  - Tendencias mensuales
  - Insights automáticos

### 📈 Visualización de Datos
- Dashboard con KPIs principales
- Datos preparados para gráficos en el frontend
- Análisis temporal de ventas
- Segmentación por categorías y regiones

### 📄 Generación de Informes PDF
- Informes PDF profesionales con ReportLab
- Gráficos embebidos usando Matplotlib
- Resumen ejecutivo automático
- Insights y recomendaciones

## Stack Tecnológico

- **Framework**: Django 5.2.1 + Django REST Framework 3.16.0
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT con djangorestframework-simplejwt
- **Análisis de Datos**: Pandas, NumPy
- **Visualización**: Matplotlib, Seaborn
- **PDF**: ReportLab
- **CORS**: django-cors-headers

## Estructura del Proyecto

```
server/
├── core/                   # Configuración principal del proyecto
│   ├── settings.py        # Configuraciones de Django
│   ├── urls.py           # URLs principales
│   └── wsgi.py           # WSGI application
├── authentication/        # Aplicación de autenticación
│   ├── models.py         # Modelo de usuario personalizado
│   ├── serializers.py    # Serializers para autenticación
│   ├── views.py          # Vistas de registro, login, perfil
│   └── urls.py           # URLs de autenticación
├── reports/               # Aplicación de informes
│   ├── models.py         # Modelos de CSV, Report, SalesData
│   ├── serializers.py    # Serializers para informes
│   ├── views.py          # Vistas para subida, análisis, PDF
│   ├── services.py       # Servicio de análisis de datos
│   ├── pdf_service.py    # Servicio de generación de PDF
│   └── urls.py           # URLs de informes
├── main/                  # Aplicación principal
│   ├── views.py          # Vistas básicas (health check, info)
│   └── urls.py           # URLs básicas
├── manage.py             # Script de gestión de Django
├── requirements.txt      # Dependencias del proyecto
├── sample_data.csv       # Datos de ejemplo para pruebas
└── env_example.txt       # Ejemplo de variables de entorno
```

## Instalación y Configuración

### Prerrequisitos

1. **Python 3.11+**
2. **PostgreSQL 12+**
3. **pip** (gestor de paquetes de Python)

### Pasos de Instalación

1. **Clonar el repositorio y navegar al directorio del servidor**
   ```bash
   cd server
   ```

2. **Crear y activar entorno virtual**
   ```bash
   python -m venv venv
   
   # En Windows
   venv\Scripts\activate
   
   # En Linux/Mac
   source venv/bin/activate
   ```

3. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configurar variables de entorno**
   
   Crea un archivo `.env` basado en `env_example.txt`:
   ```bash
   cp env_example.txt .env
   ```
   
   Edita el archivo `.env` con tus configuraciones:
   ```env
   DB_NAME=generador_informes
   DB_USER=tu_usuario_postgres
   DB_PASSWORD=tu_password_postgres
   DB_HOST=localhost
   DB_PORT=5432
   SECRET_KEY=tu_clave_secreta_aqui
   DEBUG=True
   ```

5. **Configurar base de datos PostgreSQL**
   
   Crear la base de datos:
   ```sql
   CREATE DATABASE generador_informes;
   ```

6. **Ejecutar migraciones**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Crear superusuario (opcional)**
   ```bash
   python manage.py createsuperuser
   ```

8. **Ejecutar servidor de desarrollo**
   ```bash
   python manage.py runserver
   ```

El servidor estará disponible en: `http://localhost:8000`

## Documentación de la API

### Endpoints de Autenticación

#### Registro de Usuario
- **POST** `/api/auth/register/`
- **Body**:
  ```json
  {
    "email": "usuario@ejemplo.com",
    "username": "usuario123",
    "first_name": "Juan",
    "last_name": "Pérez",
    "company": "Mi Empresa",
    "position": "Analista",
    "password": "password123",
    "password_confirm": "password123"
  }
  ```

#### Login
- **POST** `/api/auth/login/`
- **Body**:
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "password123"
  }
  ```

#### Perfil de Usuario
- **GET/PUT** `/api/auth/profile/`
- **Headers**: `Authorization: Bearer [access_token]`

#### Refrescar Token
- **POST** `/api/auth/token/refresh/`
- **Body**:
  ```json
  {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
  ```

### Endpoints de Informes

#### Subir Archivo CSV
- **POST** `/api/upload/`
- **Headers**: `Authorization: Bearer [access_token]`
- **Body**: `multipart/form-data` con archivo CSV

#### Dashboard Resumen
- **GET** `/api/dashboard/`
- **Headers**: `Authorization: Bearer [access_token]`

#### Listar Informes
- **GET** `/api/reports/`
- **Headers**: `Authorization: Bearer [access_token]`

#### Detalle de Informe
- **GET** `/api/reports/{id}/`
- **Headers**: `Authorization: Bearer [access_token]`

#### Generar PDF
- **POST** `/api/reports/{id}/generate-pdf/`
- **Headers**: `Authorization: Bearer [access_token]`

#### Descargar PDF
- **GET** `/api/reports/{id}/download-pdf/`
- **Headers**: `Authorization: Bearer [access_token]`

#### Gestionar Archivos CSV
- **GET** `/api/csv-files/` - Listar archivos
- **POST** `/api/csv-files/{id}/reprocess/` - Reprocesar archivo
- **DELETE** `/api/csv-files/{id}/delete/` - Eliminar archivo

### Endpoints Informativos

#### Información de la API
- **GET** `/api/`

#### Health Check
- **GET** `/api/health/`

## Formato de Archivo CSV

El sistema espera archivos CSV con las siguientes columnas (pueden estar en español o inglés):

### Columnas Requeridas:
- `date` / `fecha`: Fecha de la venta (YYYY-MM-DD)
- `product` / `producto`: Nombre del producto
- `sales_amount` / `ventas` / `monto`: Monto de la venta

### Columnas Opcionales:
- `category` / `categoría`: Categoría del producto
- `region` / `región`: Región de la venta
- `quantity` / `cantidad`: Cantidad vendida

### Ejemplo de CSV:
```csv
date,product,category,region,sales_amount,quantity
2024-01-15,Laptop HP,Electrónicos,Norte,1200.00,1
2024-01-16,Mouse Inalámbrico,Accesorios,Sur,25.99,3
```

## Características de Seguridad

- **JWT Authentication**: Tokens seguros con expiración
- **CORS configurado**: Para comunicación con frontend
- **Validación de archivos**: Solo archivos CSV válidos
- **Límite de tamaño**: Máximo 50MB por archivo
- **Autorización por usuario**: Cada usuario solo ve sus datos

## Modelos de Datos

### User (authentication.models)
- Modelo de usuario personalizado que extiende AbstractUser
- Campos adicionales: company, position, created_at, updated_at

### CSVFile (reports.models)
- Almacena información de archivos CSV subidos
- Estados: uploaded, processing, completed, error

### Report (reports.models)
- Contiene análisis y métricas calculadas
- Campos JSON para datos de gráficos
- Relación 1:1 con CSVFile

### SalesData (reports.models)
- Datos individuales de ventas procesados
- Campos flexibles para datos adicionales

## Análisis Automático

El sistema genera automáticamente:

### Métricas Básicas:
- Ventas totales
- Número de registros
- Rango de fechas
- Productos únicos

### Análisis por Producto:
- Top 10 productos más vendidos
- Distribución de ventas por producto

### Análisis Geográfico:
- Ventas por región
- Comparativa regional

### Análisis Temporal:
- Tendencias mensuales
- Cálculo de crecimiento periodo a periodo

### Insights Automáticos:
- Producto más exitoso
- Tendencias de crecimiento
- Alertas de declive
- Diversificación del portafolio

## Generación de PDF

Los informes PDF incluyen:

1. **Portada**: Información del archivo y fechas
2. **Resumen Ejecutivo**: Métricas principales en tabla
3. **Métricas Clave**: Top productos y detalles
4. **Análisis Visual**: Gráficos de tendencias y productos
5. **Insights Automáticos**: Conclusiones y recomendaciones
6. **Muestra de Datos**: Tabla con primeros registros

## Comandos Útiles

```bash
# Ejecutar migraciones
python manage.py migrate

# Crear migraciones
python manage.py makemigrations

# Ejecutar servidor
python manage.py runserver

# Acceder al shell de Django
python manage.py shell

# Crear superusuario
python manage.py createsuperuser

# Recopilar archivos estáticos
python manage.py collectstatic
```

## Consideraciones de Producción

Para despliegue en producción, considera:

1. **Variables de entorno**: Configura correctamente todas las variables
2. **Base de datos**: Usa PostgreSQL en producción
3. **Archivos estáticos**: Configura servicio de archivos estáticos
4. **HTTPS**: Usa certificados SSL
5. **Logs**: Configura logging apropiado
6. **Backup**: Implementa estrategia de respaldo
7. **Monitoreo**: Configura herramientas de monitoreo

## Soporte y Contribución

Para reportar bugs o solicitar features, crear issues en el repositorio del proyecto.

---

**Desarrollado por**: Kenyi Ivan Vega Aliaga  
**Versión**: 1.0.0  
**Última actualización**: Enero 2025 