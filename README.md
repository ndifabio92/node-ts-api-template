# Plantilla de API Node.js con TypeScript

Una plantilla robusta y escalable para APIs REST utilizando Node.js y TypeScript, diseñada con **Clean Architecture** para una máxima separación de responsabilidades, escalabilidad y mantenibilidad.

## 🚀 Características

- **TypeScript** - Tipado estático para mayor seguridad y productividad del desarrollador.
- **Clean Architecture** - Separación clara entre la lógica de negocio y los detalles de implementación.
- **Inyección de Dependencias Simple** - Mecanismo básico de inyección de dependencias para conectar componentes.
- **Manejo Centralizado de Errores** - Gestión consistente de errores en toda la aplicación.
- **Validación de Entorno** - Configuración robusta con validación de variables de entorno.
- **Pruebas Integrales** - Configuración completa para pruebas unitarias y de integración con Jest.
- **Mejores Prácticas de Seguridad** - Preconfigurado con Helmet y CORS.
- **Registro Estructurado** - Sistema de logging organizado e informativo.
- **Servicio de Correo Electrónico Integrado** - Servicio de correo listo para usar con Nodemailer.
- **Prisma ORM** - ORM moderno con soporte para PostgreSQL.
- **Soporte Multi-Database** - Implementaciones para PostgreSQL y MongoDB.
- **Documentación API con Swagger** - Documentación automática de endpoints.
- **Docker Compose** - Configuración para desarrollo con bases de datos.
- **Sistema de Autenticación Completo** - JWT con refresh tokens y roles.
- **Scripts de Base de Datos** - Migraciones, seeding y configuración automática.

## 📁 Estructura del Proyecto

El proyecto sigue los principios de Clean Architecture, organizando el código en capas concéntricas.

```
src/
├── application/           # Lógica de la aplicación (casos de uso)
│   ├── dtos/              # Data Transfer Objects
│   └── *.service.ts       # Orquesta el flujo de datos y lógica de negocio
├── domain/                # Lógica de negocio pura y agnóstica al framework
│   ├── entities/          # Entidades de negocio
│   ├── interfaces/        # Contratos para repositorios y servicios
│   └── schemas/           # Esquemas de validación (Zod)
├── generated/             # Archivos generados (Prisma client)
└── infrastructure/        # Detalles de implementación (frameworks, drivers)
    ├── config/            # Configuración (entorno, base de datos)
    │   ├── database/      # Configuraciones de bases de datos
    │   └── swagger.ts     # Configuración de documentación
    ├── persistence/       # Implementaciones de repositorios
    │   ├── mongodb/       # Implementaciones MongoDB
    │   ├── postgresql/    # Implementaciones PostgreSQL
    │   └── repository.factory.ts
    ├── shared/            # Utilidades y constantes compartidas
    └── web/               # Relacionado con la capa web (Express)
        ├── app.ts         # Configuración principal de Express
        ├── server.ts      # Punto de entrada del servidor
        ├── controllers/   # Controladores (manejan req/res HTTP)
        ├── docs/          # Documentación Swagger por módulo
        ├── middlewares/   # Middlewares de Express
        └── routes/        # Definición y registro de rutas
```

### Conceptos Clave

- **`domain`**: El núcleo de la aplicación. Contiene la lógica de negocio más pura y no depende de ninguna otra capa. Aquí se definen entidades, interfaces (contratos) y esquemas de validación.
- **`application`**: Orquesta los flujos de datos y ejecuta los casos de uso. Depende de `domain` pero no de `infrastructure`. Contiene los servicios que implementan la lógica de la aplicación.
- **`infrastructure`**: Contiene todos los detalles técnicos y dependencias externas como la base de datos, el servidor web (Express), servicios de terceros (Nodemailer), etc. Esta capa depende de `application` y `domain`.
- **Flujo de Dependencias**: El flujo de dependencias es unidireccional, siempre apuntando hacia adentro: `infrastructure` -> `application` -> `domain`.

## 🚀 Cómo Agregar un Nuevo Módulo

1.  **Define el Dominio**:

    - Crea las interfaces necesarias en `src/domain/interfaces/` (ej. `IUsuarioRepository.ts`).
    - Crea los esquemas de validación en `src/domain/schemas/` (ej. `usuario.schema.ts`).
    - Crea las entidades en `src/domain/entities/` si es necesario.

2.  **Crea el Caso de Uso (Servicio)**:

    - Agrega `usuario.service.ts` en `src/application/`. Este servicio implementará la lógica de negocio y dependerá de las interfaces del dominio.

3.  **Implementa los Detalles de Infraestructura**:

    - **Repositorio**: Crea implementaciones en `src/infrastructure/persistence/mongodb/repositories/` y `src/infrastructure/persistence/postgresql/repositories/`.
    - **Controlador**: Crea `usuario.controller.ts` en `src/infrastructure/web/controllers/`.
    - **Rutas**: Crea `usuario.routes.ts` en `src/infrastructure/web/routes/`.
    - **Documentación**: Crea `usuario.swagger.ts` en `src/infrastructure/web/docs/usuario/`.

4.  **Registra la Ruta** en `src/infrastructure/web/routes/routes-definitions.ts`:

    ```typescript
    // src/infrastructure/web/routes/routes-definitions.ts
    import { UsuarioController } from "../controllers/usuario.controller";
    import { UsuarioService } from "../../../application/usuario.service";
    import { UsuarioRepository } from "../../persistence/mongodb/repositories/usuario.mongodb.repository";
    import { UsuarioRouter } from "./usuario.routes";

    export const routes: IRoute[] = [
      // ... otras rutas
      {
        path: "/usuarios",
        router: UsuarioRouter,
        controller: UsuarioController,
        dependencies: [UsuarioRepository, UsuarioService], // El orden es importante para la inyección manual
      },
    ];
    ```

## 🛠️ Instalación

1.  **Clona el repositorio**

    ```bash
    git clone https://github.com/ndifabio92/node-ts-api-template.git
    cd node-ts-api-template
    ```

2.  **Instala las dependencias**

    ```bash
    npm install
    ```

3.  **Configura las variables de entorno**

    Crea un archivo `.env` basado en el ejemplo:

    ```env
    # Servidor
    PORT=4000
    NODE_ENV=development
    CORS_ORIGIN=*

    # Base de Datos PostgreSQL
    DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
    POSTGRES_USER=postgres
    POSTGRES_DB=node_template
    POSTGRES_PASSWORD=password

    # Base de Datos MongoDB
    MONGO_USER=admin
    MONGO_PASS=password
    MONGODB_URI=mongodb://admin:password@localhost:27017/node_template

    # Configuración de Correo Electrónico
    MAILER_SERVICE=gmail
    MAILER_EMAIL=tu-email@gmail.com
    MAILER_SECRET_KEY=tu-contraseña-de-aplicación

    # JWT
    JWT_SECRET=tu-jwt-secret-super-seguro
    JWT_REFRESH_SECRET=tu-jwt-refresh-secret-super-seguro
    ```

4.  **Configura las bases de datos**

    ```bash
    # Inicia las bases de datos con Docker
    docker-compose up -d

    # Genera el cliente de Prisma
    npm run db:generate

    # Ejecuta las migraciones
    npm run db:migrate

    # Opcional: Seed de datos iniciales
    npm run db:seed
    npm run db:seed:admin
    ```

5.  **Ejecuta en modo desarrollo**
    ```bash
    npm run dev
    ```

## 📜 Scripts Disponibles

### Desarrollo

- `npm run dev`: Inicia el servidor en modo desarrollo con recarga en caliente
- `npm run build`: Compila el código TypeScript a JavaScript
- `npm start`: Ejecuta la aplicación compilada en producción
- `npm run type-check`: Ejecuta el compilador de TypeScript para verificar errores de tipos

### Pruebas

- `npm test`: Ejecuta todas las pruebas (unitarias y de integración)
- `npm run test:unit`: Ejecuta solo las pruebas unitarias
- `npm run test:integration`: Ejecuta solo las pruebas de integración
- `npm run test:coverage`: Genera un informe de cobertura de código
- `npm run test:watch`: Ejecuta las pruebas en modo watch

### Linting

- `npm run lint`: Ejecuta ESLint en el código fuente
- `npm run lint:fix`: Corrige automáticamente los errores de ESLint

### Base de Datos

- `npm run db:generate`: Genera el cliente de Prisma
- `npm run db:migrate`: Ejecuta las migraciones de desarrollo
- `npm run db:migrate:deploy`: Ejecuta las migraciones en producción
- `npm run db:reset`: Resetea la base de datos
- `npm run db:setup`: Configura la base de datos inicial
- `npm run db:studio`: Abre Prisma Studio para gestionar la base de datos
- `npm run db:seed`: Ejecuta el seeding de datos
- `npm run db:seed:admin`: Crea un usuario administrador

## 🔧 Configuración

### Variables de Entorno

| Variable             | Descripción                            | Requerido | Valor por defecto |
| -------------------- | -------------------------------------- | --------- | ----------------- |
| `PORT`               | Puerto del servidor                    | No        | 4000              |
| `NODE_ENV`           | Entorno de ejecución                   | No        | development       |
| `CORS_ORIGIN`        | Orígenes permitidos para CORS          | No        | `*`               |
| `DATABASE_URL`       | URL de conexión PostgreSQL             | Sí        | -                 |
| `POSTGRES_USER`      | Usuario PostgreSQL                     | Sí        | -                 |
| `POSTGRES_DB`        | Nombre de la base de datos PostgreSQL  | Sí        | -                 |
| `POSTGRES_PASSWORD`  | Contraseña PostgreSQL                  | Sí        | -                 |
| `MONGO_USER`         | Usuario MongoDB                        | Sí        | -                 |
| `MONGO_PASS`         | Contraseña MongoDB                     | Sí        | -                 |
| `MONGODB_URI`        | URI de conexión MongoDB                | Sí        | -                 |
| `MAILER_SERVICE`     | Proveedor de servicio de email         | Sí        | -                 |
| `MAILER_EMAIL`       | Dirección de correo del remitente      | Sí        | -                 |
| `MAILER_SECRET_KEY`  | Contraseña específica de la aplicación | Sí        | -                 |
| `JWT_SECRET`         | Clave secreta para JWT                 | Sí        | -                 |
| `JWT_REFRESH_SECRET` | Clave secreta para refresh JWT         | Sí        | -                 |

### TypeScript

El proyecto utiliza TypeScript 5.x con configuraciones estrictas habilitadas para garantizar alta calidad de código y mantenibilidad.

### ESLint

ESLint está configurado con reglas modernas para TypeScript para hacer cumplir las mejores prácticas y la consistencia del código.

### Prisma

Prisma ORM está configurado para PostgreSQL con:

- Migraciones automáticas
- Generación de cliente
- Studio para gestión visual de datos
- Seeding de datos iniciales

## 🧪 Pruebas

- **Jest**: Utilizado como marco de pruebas principal
- **Supertest**: Para realizar solicitudes HTTP en pruebas de integración
- **Cobertura de Código**: Los informes se generan a través del proveedor de cobertura de Jest
- **Separación Clara**: Las pruebas unitarias (`/unit`) y de integración (`/integration`) se mantienen separadas

### Ejecutando las Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar solo pruebas unitarias
npm run test:unit

# Ejecutar solo pruebas de integración
npm run test:integration

# Generar informe de cobertura
npm run test:coverage

# Ejecutar en modo watch
npm run test:watch
```

## 🔒 Seguridad

- **Helmet**: Ayuda a proteger la aplicación Express configurando varias cabeceras HTTP
- **CORS**: Configurado para gestionar el Intercambio de Recursos de Origen Cruzado
- **JWT**: Autenticación basada en tokens con refresh tokens
- **Validación de Entrada**: Esquemas de validación con Zod
- **Roles y Permisos**: Sistema de roles (admin, user, moderator)

## 📚 Documentación API

La API incluye documentación automática con Swagger UI disponible en:

- **Desarrollo**: `http://localhost:4000/api-docs`
- **Producción**: `http://your-domain.com/api-docs`

### Endpoints Principales

#### Autenticación

- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `POST /auth/refresh-token` - Renovar tokens
- `POST /auth/logout` - Cerrar sesión
- `GET /auth/me` - Obtener usuario autenticado

#### Usuarios

- `GET /users/profile` - Perfil del usuario autenticado
- `GET /users/profile/:username` - Perfil público de usuario
- `PUT /users/profile` - Actualizar perfil

#### Email

- `POST /email/send` - Enviar email

#### Health

- `GET /health` - Estado del servicio

Para más detalles, consulta el archivo `API_ENDPOINTS.md`.

## 🐳 Docker

El proyecto incluye configuración de Docker Compose para desarrollo:

```bash
# Iniciar bases de datos
docker-compose up -d

# Detener bases de datos
docker-compose down
```

### Servicios Incluidos

- **PostgreSQL 16**: Base de datos principal
- **MongoDB 7.0**: Base de datos alternativa

## 🚀 Despliegue

### Construcción para Producción

1.  **Construye el proyecto**

    ```bash
    npm run build
    ```

2.  **Configura las variables de entorno de producción**

3.  **Ejecuta las migraciones de producción**

    ```bash
    npm run db:migrate:deploy
    ```

4.  **Inicia el servidor**
    ```bash
    npm start
    ```

### Consideraciones de Producción

- Configura variables de entorno seguras
- Usa HTTPS en producción
- Configura CORS apropiadamente
- Monitorea logs y métricas
- Configura backup de bases de datos
- Usa un proceso manager como PM2

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.
