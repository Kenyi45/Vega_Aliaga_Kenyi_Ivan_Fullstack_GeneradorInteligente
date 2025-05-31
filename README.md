# 🚀 Generador Inteligente de Contenido

Un proyecto fullstack moderno para la generación automática de contenido usando inteligencia artificial.

## 📋 Descripción

Sistema completo de generación de contenido que permite a los usuarios crear proyectos, generar contenido usando IA simulada, y realizar análisis de datos con visualizaciones interactivas.

## 🛠️ Tecnologías

### Backend
- **Django REST Framework** - API REST robusta
- **PostgreSQL** - Base de datos relacional
- **Pandas** - Análisis y manipulación de datos
- **Python 3.x** - Lenguaje principal del backend

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de construcción rápida
- **Tailwind CSS** - Framework de CSS utilitario
- **React Query** - Gestión de estado del servidor
- **Axios** - Cliente HTTP

## 🏗️ Estructura del Proyecto

Vega_Aliaga_Kenyi_Ivan_Fullstack_GeneradorInteligente/
├── server/ # Backend Django
│ ├── core/ # Configuración principal de Django
│ ├── main/ # Aplicación principal
│ ├── venv/ # Entorno virtual Python
│ ├── manage.py # Comando de gestión Django
│ └── requirements.txt # Dependencias Python
├── user/ # Frontend React
│ ├── src/ # Código fuente React
│ ├── public/ # Archivos públicos
│ ├── package.json # Dependencias Node.js
│ └── vite.config.ts # Configuración Vite
└── README.md # Documentación principal


## 🚀 Instalación y Configuración

### Prerrequisitos
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/Vega_Aliaga_Kenyi_Ivan_Fullstack_GeneradorInteligente.git
cd Vega_Aliaga_Kenyi_Ivan_Fullstack_GeneradorInteligente
```

### 2. Configurar el Backend

```bash
# Navegar al directorio del backend
cd server

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Ejecutar migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver
```

### 3. Configurar el Frontend

```bash
# En una nueva terminal, navegar al directorio del frontend
cd user

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

## 🌐 URLs del Proyecto

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Admin Django**: http://localhost:8000/admin

## 📚 API Endpoints

### Proyectos
- `GET /api/projects/` - Listar proyectos
- `POST /api/projects/` - Crear proyecto
- `GET /api/projects/{id}/` - Obtener proyecto específico
- `PUT /api/projects/{id}/` - Actualizar proyecto
- `DELETE /api/projects/{id}/` - Eliminar proyecto
- `GET /api/projects/stats/` - Estadísticas de proyectos

### Contenido Generado
- `GET /api/contents/` - Listar contenidos
- `POST /api/contents/generate/` - Generar nuevo contenido
- `DELETE /api/contents/{id}/` - Eliminar contenido

### Análisis de Datos
- `GET /api/analyses/` - Listar análisis
- `POST /api/analyses/sample_analysis/` - Crear análisis de muestra

## 🎯 Funcionalidades

### ✅ Completadas
- [x] Sistema de autenticación de usuarios
- [x] CRUD completo de proyectos
- [x] Generación de contenido con IA simulada
- [x] Dashboard con estadísticas en tiempo real
- [x] Análisis de datos con Pandas
- [x] Interfaz responsive con Tailwind CSS
- [x] Gestión de estado con React Query

### 🚧 En desarrollo
- [ ] Integración con APIs de IA reales (OpenAI, etc.)
- [ ] Sistema de plantillas de contenido
- [ ] Exportación de reportes en PDF
- [ ] Visualizaciones de datos con gráficos
- [ ] Sistema de colaboración entre usuarios

### 💡 Futuras mejoras
- [ ] Integración con servicios de almacenamiento en la nube
- [ ] Análisis de sentimientos en el contenido
- [ ] Sistema de versionado de contenido
- [ ] API webhooks para integraciones
- [ ] Aplicación móvil

## 🧪 Testing

### Backend
```bash
cd server
python manage.py test
```

### Frontend
```bash
cd user
npm run test
```

## 🚀 Despliegue

### Desarrollo
- Frontend: Vite dev server
- Backend: Django development server
- Base de datos: PostgreSQL local

### Producción
- Frontend: Build estático deployado en Vercel/Netlify
- Backend: Django en Railway/Heroku/DigitalOcean
- Base de datos: PostgreSQL en la nube

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Kenyi Ivan Vega Aliaga**
- GitHub: [@TU_USUARIO](https://github.com/TU_USUARIO)
- LinkedIn: [Tu LinkedIn](https://linkedin.com/in/tu-perfil)
- Email: tu.email@example.com

## 🙏 Agradecimientos

- Django REST Framework por la excelente documentación
- React y Vite por las herramientas de desarrollo
- Tailwind CSS por el sistema de diseño
- PostgreSQL por la robusta base de datos

---

⭐ ¡No olvides dar una estrella al proyecto si te ha sido útil!