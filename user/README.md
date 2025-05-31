# IntelliReport - Frontend

Aplicación web frontend para el Generador Inteligente de Informes Empresariales construida con React + TypeScript + Vite.

## 🚀 Características

- **Dashboard Interactivo**: Visualización de estadísticas y métricas clave
- **Upload de Archivos**: Interfaz drag & drop para subir archivos CSV
- **Visualización de Datos**: Gráficos interactivos con Recharts
- **Informes Inteligentes**: Visualización de análisis automáticos
- **Autenticación JWT**: Sistema de login/registro seguro
- **Responsive Design**: Interfaz adaptativa para todos los dispositivos
- **PDF Generation**: Generación y descarga de informes en PDF

## 🛠️ Stack Tecnológico

- **React 19** - Biblioteca para interfaces de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de construcción y desarrollo
- **Tailwind CSS** - Framework CSS utilitario
- **React Query** - Manejo de estado del servidor
- **React Router** - Enrutamiento del lado del cliente
- **Recharts** - Biblioteca de gráficos para React
- **React Hook Form** - Manejo de formularios
- **React Dropzone** - Componente para upload de archivos
- **Lucide React** - Iconos SVG
- **Axios** - Cliente HTTP
- **date-fns** - Biblioteca para manejo de fechas

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Backend API ejecutándose en http://localhost:8000

## ⚡ Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:8000/api
NODE_ENV=development
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000

### 4. Construir para producción

```bash
npm run build
```

### 5. Vista previa de producción

```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── auth/           # Componentes de autenticación
│   ├── charts/         # Componentes de gráficos
│   ├── dashboard/      # Componentes del dashboard
│   ├── layout/         # Componentes de layout
│   ├── reports/        # Componentes de informes
│   ├── ui/            # Componentes UI básicos
│   └── upload/        # Componentes de upload
├── contexts/           # Contextos de React
├── hooks/             # Hooks personalizados
├── pages/             # Páginas principales
├── providers/         # Proveedores de contexto
├── services/          # Servicios de API
├── types/             # Definiciones de tipos TypeScript
├── utils/             # Utilidades y helpers
├── App.tsx            # Componente principal
└── main.tsx           # Punto de entrada
```

## 🔧 Componentes Principales

### Autenticación
- `LoginForm` - Formulario de inicio de sesión
- `RegisterForm` - Formulario de registro
- `ProtectedRoute` - Protección de rutas

### Dashboard
- `StatsCard` - Tarjetas de estadísticas
- `RecentReports` - Lista de informes recientes
- `DashboardPage` - Página principal del dashboard

### Upload
- `FileDropzone` - Área de arrastre para archivos
- `FileList` - Lista de archivos subidos

### Gráficos
- `SalesBarChart` - Gráfico de barras de ventas
- `SalesPieChart` - Gráfico circular de ventas
- `SalesLineChart` - Gráfico de líneas de ventas
- `MonthlyTrendsChart` - Gráfico de tendencias mensuales

### Informes
- `ReportView` - Visualización completa de informes

## 🎨 Sistema de Diseño

La aplicación utiliza Tailwind CSS con un sistema de diseño consistente:

- **Colores principales**: Azul (#3B82F6), Verde (#10B981), Amarillo (#F59E0B)
- **Tipografía**: Inter font family
- **Espaciado**: Sistema de espaciado de Tailwind (4px base)
- **Componentes**: Biblioteca propia de componentes UI reutilizables

## 🔌 Integración con API

La aplicación se conecta con el backend Django a través de:

- **Axios** para requests HTTP
- **Interceptores** para manejo automático de tokens JWT
- **React Query** para cache y sincronización de datos
- **Error handling** centralizado

### Endpoints principales:
- `POST /auth/login/` - Inicio de sesión
- `POST /auth/register/` - Registro de usuario
- `GET /reports/dashboard/` - Datos del dashboard
- `POST /files/upload/` - Subida de archivos CSV
- `GET /reports/{id}/` - Detalle de informe
- `POST /reports/{id}/generate-pdf/` - Generación de PDF

## 🚀 Flujo de Usuario

1. **Autenticación**: Usuario se registra o inicia sesión
2. **Dashboard**: Visualiza estadísticas generales
3. **Upload**: Sube archivo CSV de ventas
4. **Procesamiento**: Sistema analiza automáticamente los datos
5. **Visualización**: Usuario ve gráficos e insights generados
6. **Export**: Descarga informe en PDF

## 🧪 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Vista previa
npm run preview

# Linting
npm run lint
```

## 🐛 Solución de Problemas

### Error de conexión con API
- Verificar que el backend esté ejecutándose
- Comprobar la variable `VITE_API_BASE_URL`
- Revisar CORS en el backend

### Problemas con gráficos
- Verificar que los datos tengan el formato correcto
- Comprobar que Recharts esté instalado

### Errores de autenticación
- Limpiar localStorage
- Verificar tokens JWT en el backend

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

Utiliza clases responsive de Tailwind (`sm:`, `md:`, `lg:`, `xl:`) para adaptación automática.

## 🎯 Próximas Características

- [ ] Modo oscuro
- [ ] Notificaciones en tiempo real
- [ ] Filtros avanzados en informes
- [ ] Exportación a Excel
- [ ] Colaboración entre usuarios
- [ ] Plantillas de informes personalizables

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🔗 Enlaces

- [Backend Repository](../server/)
- [Documentación de la API](../server/API_EXAMPLES.md)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest)
- [Recharts](https://recharts.org/)
