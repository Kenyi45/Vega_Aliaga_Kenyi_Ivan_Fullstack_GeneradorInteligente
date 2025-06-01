# 🚀 IntelliReport - Generador Inteligente de Informes Empresariales

Un sistema fullstack moderno para la transformación automática de datos CSV en informes empresariales inteligentes con análisis automatizado e insights generados por IA.

## 📋 Descripción

**IntelliReport** es una plataforma completa que permite a las empresas transformar archivos CSV de datos de ventas en informes visuales profesionales, análisis automáticos y resúmenes ejecutivos. El sistema procesa los datos, genera métricas clave, visualizaciones interactivas y proporciona insights automáticos para la toma de decisiones empresariales.

### 🎯 Principales Características

- **📤 Upload Inteligente**: Interfaz drag & drop para archivos CSV con validación automática
- **📊 Dashboard Interactivo**: Visualización en tiempo real de KPIs y métricas empresariales  
- **🤖 Análisis Automático**: Procesamiento de datos con generación de insights automáticos
- **📈 Visualizaciones Dinámicas**: Gráficos interactivos (líneas, barras, pie charts)
- **📄 Informes PDF**: Generación automática de reportes profesionales
- **🔐 Autenticación JWT**: Sistema seguro de usuarios con tokens
- **💰 Moneda Localizada**: Soporte para soles peruanos (PEN)
- **📱 Responsive Design**: Interfaz adaptativa para todos los dispositivos

## 🛠️ Stack Tecnológico

### Backend (Django REST API)
- **Framework**: Django 5.2.1 + Django REST Framework 3.16.0
- **Base de Datos**: PostgreSQL 12+ / SQLite (desarrollo)
- **Autenticación**: JWT con djangorestframework-simplejwt 5.2.2
- **Análisis de Datos**: Pandas 2.1.4, NumPy 1.21+
- **Visualización**: Matplotlib 3.8.2, Seaborn 0.13.0
- **Generación PDF**: ReportLab 4.0.7
- **Manejo de Archivos**: Pillow 10.1.0, openpyxl 3.1.2
- **CORS**: django-cors-headers 4.7.0

### Frontend (React + TypeScript)
- **Framework**: React 19.1.0 + TypeScript 5.8.3
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 3.4.15
- **UI Components**: Headless UI 2.2.0, Lucide React 0.468.0
- **State Management**: TanStack React Query 5.79.0
- **Routing**: React Router DOM 7.6.1
- **Charts**: Recharts 2.13.3
- **Forms**: React Hook Form 7.53.2
- **File Upload**: React Dropzone 14.2.9
- **HTTP Client**: Axios 1.9.0
- **PDF Export**: jsPDF 3.0.1, html2canvas 1.4.1
- **Date Handling**: date-fns 4.1.0

## 🏗️ Estructura del Proyecto

```
Vega_Aliaga_Kenyi_Ivan_Fullstack_GeneradorInteligente/
├── server/                     # Backend Django
│   ├── core/                  # Configuración principal
│   │   ├── settings.py       # Settings de Django
│   │   ├── urls.py          # URLs principales
│   │   └── wsgi.py          # WSGI application
│   ├── authentication/       # Sistema de autenticación
│   │   ├── models.py        # Modelo de usuario personalizado
│   │   ├── serializers.py   # Serializers JWT
│   │   ├── views.py         # Login, registro, perfil
│   │   └── urls.py          # URLs de auth
│   ├── reports/             # Gestión de informes
│   │   ├── models.py        # CSV, Report, SalesData
│   │   ├── serializers.py   # Serializers de informes
│   │   ├── views.py         # Upload, análisis, PDF
│   │   ├── services.py      # Análisis de datos
│   │   ├── pdf_service.py   # Generación PDF
│   │   └── urls.py          # URLs de reports
│   ├── main/                # Aplicación principal
│   ├── media/               # Archivos subidos
│   ├── logs/                # Logs del sistema
│   ├── requirements.txt     # Dependencias Python
│   ├── manage.py           # Django management
│   ├── sample_data.csv     # Datos de ejemplo
│   └── README.md           # Documentación backend
├── user/                   # Frontend React
│   ├── src/               # Código fuente
│   │   ├── components/    # Componentes React
│   │   │   ├── auth/     # Autenticación
│   │   │   ├── dashboard/ # Dashboard
│   │   │   ├── layout/   # Layout y navegación
│   │   │   ├── reports/  # Informes
│   │   │   └── ui/       # Componentes UI
│   │   ├── contexts/     # Contextos React
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Páginas principales
│   │   ├── services/     # Servicios API
│   │   ├── types/        # Tipos TypeScript
│   │   ├── utils/        # Utilidades
│   │   ├── App.tsx       # Componente principal
│   │   └── main.tsx      # Entry point
│   ├── public/           # Archivos públicos
│   ├── package.json      # Dependencias Node.js
│   ├── vite.config.ts    # Configuración Vite
│   ├── tailwind.config.js # Configuración Tailwind
│   └── README.md         # Documentación frontend
└── README.md             # Documentación principal
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL 12+** (opcional, SQLite por defecto)
- **Git**

### 1. Clonar el Repositorio
```bash
git clone https://github.com/TU_USUARIO/Vega_Aliaga_Kenyi_Ivan_Fullstack_GeneradorInteligente.git
cd Vega_Aliaga_Kenyi_Ivan_Fullstack_GeneradorInteligente
```

### 2. Configurar el Backend (Django)

```bash
# Navegar al directorio del backend
cd server

# Crear y activar entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp env_example.txt .env
# Editar .env con tus configuraciones

# Ejecutar migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario (opcional)
python manage.py createsuperuser

# Ejecutar servidor de desarrollo
python manage.py runserver
```

### 3. Configurar el Frontend (React)

```bash
# En una nueva terminal, navegar al frontend
cd user

# Instalar dependencias
npm install

# Configurar variables de entorno
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env

# Ejecutar servidor de desarrollo
npm run dev
```

## 🌐 URLs del Proyecto

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Admin Django**: http://localhost:8000/admin
- **API Documentation**: http://localhost:8000/api/docs (swagger)

## 📚 API Endpoints Principales

### Autenticación
- `POST /api/auth/register/` - Registro de usuario
- `POST /api/auth/login/` - Inicio de sesión
- `POST /api/auth/token/refresh/` - Refrescar token
- `GET/PUT /api/auth/profile/` - Perfil de usuario

### Informes y Datos
- `POST /api/upload/` - Subir archivo CSV
- `GET /api/dashboard/` - Datos del dashboard
- `GET /api/reports/` - Lista de informes
- `GET /api/reports/{id}/` - Detalle de informe
- `GET /api/reports/{id}/download-pdf/` - Descargar PDF

### Datos de Ejemplo CSV
El archivo debe contener columnas como:
```csv
fecha,producto,categoria,region,cantidad,sales_amount
2024-01-15,Laptop Pro,Electrónicos,Norte,2,1500.00
2024-01-16,Mouse,Accesorios,Sur,5,45.99
```

## 🎯 Funcionalidades Implementadas

### ✅ Completadas
- [x] **Sistema de autenticación completo** con JWT
- [x] **Dashboard interactivo** con KPIs en tiempo real
- [x] **Upload de archivos CSV** con validación
- [x] **Análisis automático de datos** con Pandas
- [x] **Visualizaciones dinámicas** con Recharts
- [x] **Generación de informes PDF** con ReportLab
- [x] **Gestión de usuarios** y perfiles
- [x] **Responsive design** con Tailwind CSS
- [x] **Formato de moneda** en soles peruanos (PEN)
- [x] **Validación de tipos** TypeScript
- [x] **Manejo de errores** y loading states

### 🚧 En Desarrollo
- [ ] Filtros avanzados en dashboard
- [ ] Comparación entre períodos
- [ ] Exportación a Excel
- [ ] Notificaciones en tiempo real
- [ ] Modo oscuro

### 💡 Futuras Mejoras
- [ ] Integración con APIs de IA reales (OpenAI)
- [ ] Análisis predictivo con Machine Learning
- [ ] Sistema de colaboración multi-usuario
- [ ] Integración con bases de datos externas
- [ ] Aplicación móvil nativa
- [ ] Webhooks para integraciones

## 🧪 Testing y Desarrollo

### Backend
```bash
cd server
python manage.py test
```

### Frontend
```bash
cd user
npm run lint          # Linting
npm run build         # Build producción
npm run preview       # Preview build
```

## 🚀 Despliegue

### Desarrollo Local
- **Frontend**: Vite dev server (puerto 5173)
- **Backend**: Django development server (puerto 8000)
- **Base de datos**: SQLite local

### Producción Recomendada
- **Frontend**: Vercel, Netlify, o GitHub Pages
- **Backend**: Railway, Heroku, DigitalOcean, o AWS
- **Base de datos**: PostgreSQL en la nube (ElephantSQL, AWS RDS)
- **Archivos**: AWS S3 o similar para media files

### Variables de Entorno Producción

**Backend (.env)**:
```env
SECRET_KEY=key
DEBUG=True
DB_NAME=generador_db
DB_USER=postgres
DB_PASSWORD=admin
DB_HOST=localhost
DB_PORT=5433

# Configuración de CORS (para desarrollo)
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=10000

# Security Configuration
VITE_APP_NAME=IntelliReport
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Features Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false
VITE_ENABLE_PERFORMANCE_MONITORING=false

# Security Headers
VITE_CSP_NONCE=
VITE_API_KEY_HEADER=X-API-Key

# Upload Configuration
VITE_MAX_FILE_SIZE=52428800
VITE_ALLOWED_FILE_TYPES=.csv,.xlsx,.xls

# Session Configuration
VITE_SESSION_TIMEOUT=3600000
VITE_REFRESH_TOKEN_THRESHOLD=300000

# Development Only (remove in production)
VITE_DEBUG_MODE=false
VITE_MOCK_API=false 
```

## 🤝 Contribución

1. **Fork** el proyecto
2. **Crea una rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre un Pull Request**

### Convenciones de Código
- **Backend**: PEP 8 para Python
- **Frontend**: ESLint + Prettier para TypeScript/React
- **Commits**: Conventional Commits
- **Testing**: Cobertura mínima del 80%

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Django REST Framework** por la robusta API
- **React y Vite** por las herramientas de desarrollo modernas
- **Tailwind CSS** por el sistema de diseño eficiente
- **Recharts** por las visualizaciones interactivas
- **PostgreSQL** por la base de datos confiable
- **Pandas** por el potente análisis de datos

## 📞 Contacto

**Desarrollador**: Kenyi Ivan Vega Aliaga

---

⭐ **¡Dale una estrella al proyecto si te ha sido útil!** ⭐

## 🔧 Comandos Rápidos

```bash
# Desarrollo completo (ambos servidores)
# Terminal 1:
cd server && python manage.py runserver

# Terminal 2:
cd user && npm run dev

# Reset completo de base de datos
cd server
rm db.sqlite3
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

# Build de producción
cd user
npm run build

# Limpieza de dependencias
cd user && rm -rf node_modules && npm install
cd server && pip install -r requirements.txt --force-reinstall
```