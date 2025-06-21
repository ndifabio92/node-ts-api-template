# Node.js TypeScript API Template

Una plantilla robusta y escalable para APIs REST con Node.js y TypeScript, siguiendo principios de arquitectura limpia.

## 🚀 Características

- **TypeScript** - Tipado estático para mayor seguridad y productividad
- **Arquitectura Limpia** - Separación clara de responsabilidades
- **Inyección de Dependencias** - Sistema elegante para manejar dependencias
- **Manejo de Errores Centralizado** - Gestión consistente de errores
- **Validación de Environment** - Configuración robusta con validaciones
- **Testing** - Configuración completa para tests unitarios e integración
- **Seguridad** - Helmet y CORS configurados
- **Logging** - Sistema de logging estructurado
- **Email Service** - Servicio de email integrado con Nodemailer

## 📁 Estructura del Proyecto

```
src/
├── app.ts                 # Punto de entrada de la aplicación
├── config/               # Configuraciones
│   ├── environment.ts    # Variables de entorno
│   └── database/         # Configuraciones de base de datos
├── controllers/          # Controladores de la API
├── services/            # Lógica de negocio
│   └── email/           # Servicio de email
├── routes/              # Definición de rutas
├── middlewares/         # Middlewares personalizados
├── interfaces/          # Interfaces TypeScript
├── models/             # Modelos de datos
├── repositories/       # Capa de acceso a datos
└── shared/            # Utilidades compartidas
    ├── constants/      # Constantes de la aplicación
    └── utils/          # Utilidades generales
```

## 🛠️ Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/ndifabio92/node-ts-api-template.git
   cd node-ts-api-template
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   ```

   Editar `.env` con tus configuraciones:

   ```env
   PORT=4000
   NODE_ENV=development
   CORS_ORIGIN=*

   # Email Configuration
   MAILER_SERVICE=gmail
   MAILER_EMAIL=your-email@gmail.com
   MAILER_SECRET_KEY=your-app-password
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 📜 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo con hot reload
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Ejecutar en producción
- `npm test` - Ejecutar todos los tests
- `npm run test:unit` - Ejecutar tests unitarios
- `npm run test:integration` - Ejecutar tests de integración
- `npm run test:coverage` - Generar reporte de cobertura
- `npm run lint` - Verificar código con ESLint
- `npm run lint:fix` - Corregir errores de ESLint automáticamente
- `npm run type-check` - Verificar tipos de TypeScript

## 🔧 Configuración

### Variables de Entorno

| Variable            | Descripción                   | Requerido | Por Defecto |
| ------------------- | ----------------------------- | --------- | ----------- |
| `PORT`              | Puerto del servidor           | No        | 4000        |
| `DEVELOPMENT`       | Ambiente de ejecución         | No        | development |
| `CORS_ORIGIN`       | Orígenes permitidos para CORS | No        | \*          |
| `MAILER_SERVICE`    | Servicio de email             | Sí        | -           |
| `MAILER_EMAIL`      | Email del remitente           | Sí        | -           |
| `MAILER_SECRET_KEY` | Contraseña de aplicación      | Sí        | -           |

### TypeScript

El proyecto está configurado con TypeScript 5.x y configuraciones estrictas para garantizar la calidad del código.

### ESLint

Configuración de ESLint con reglas específicas para TypeScript y mejores prácticas.

## 🧪 Testing

El proyecto incluye configuración completa para testing:

- **Jest** como framework de testing
- **Supertest** para tests de integración
- **Cobertura de código** configurada
- **Tests unitarios** y **de integración** separados

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Solo tests unitarios
npm run test:unit

# Solo tests de integración
npm run test:integration

# Con cobertura
npm run test:coverage
```

## 🔒 Seguridad

- **Helmet** - Headers de seguridad HTTP
- **CORS** - Configuración de Cross-Origin Resource Sharing

## 🚀 Despliegue

### Producción

1. **Compilar el proyecto**

   ```bash
   npm run build
   ```

2. **Configurar variables de entorno de producción**

3. **Ejecutar**
   ```bash
   npm start
   ```
