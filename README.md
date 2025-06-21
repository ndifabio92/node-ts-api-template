# Plantilla de API Node.js con TypeScript

Una plantilla robusta y escalable para APIs REST utilizando Node.js y TypeScript, diseñada con una arquitectura modular para una mejor separación de responsabilidades y mantenibilidad.

## 🚀 Características

- **TypeScript** - Tipado estático para mayor seguridad y productividad del desarrollador.
- **Arquitectura Modular** - Separación clara de responsabilidades por característica/módulo.
- **Inyección de Dependencias Simple** - Mecanismo básico de inyección de dependencias para conectar componentes.
- **Manejo Centralizado de Errores** - Gestión consistente de errores en toda la aplicación.
- **Validación de Entorno** - Configuración robusta con validación de variables de entorno.
- **Pruebas Integrales** - Configuración completa para pruebas unitarias y de integración con Jest.
- **Mejores Prácticas de Seguridad** - Preconfigurado con Helmet y CORS.
- **Registro Estructurado** - Sistema de logging organizado e informativo.
- **Servicio de Correo Electrónico Integrado** - Servicio de correo listo para usar con Nodemailer, abstraído detrás de un patrón repositorio.

## 📁 Estructura del Proyecto

El proyecto sigue una arquitectura modular, donde cada característica de negocio está encapsulada en su propio módulo.

```
src/
├── app.ts                 # Configuración principal de la aplicación Express (middlewares, etc.)
├── server.ts              # Punto de entrada del servidor (inicia el servidor HTTP)
├── config/                # Archivos de configuración (entorno, swagger, base de datos)
├── core/                  # Preocupaciones transversales compartidas
│   ├── constants/         # Constantes de toda la aplicación
│   ├── interfaces/        # Interfaces genéricas (ej., IRoute)
│   └── utils/             # Utilidades compartidas (logger, httpResponse)
├── middlewares/           # Middlewares globales de Express (ej., errorHandler)
├── modules/               # Módulos de la aplicación (características)
│   └── health/            # Ejemplo: Módulo de Verificación de Salud
│       ├── health.controller.ts
│       ├── health.service.ts
│       ├── health.routes.ts
│       └── docs/
│           └── health.swagger.ts
│   └── email/             # Ejemplo: Módulo de Correo Electrónico
│       ├── email.controller.ts
│       ├── email.service.ts
│       ├── email.repository.ts
│       ├── email.routes.ts
│       ├── dtos/
│       ├── schemas/
│       └── docs/
└── routes/                # Registro centralizado de rutas
    ├── index.ts           # Agrega y registra todas las rutas de los módulos
    └── routes.ts          # Define el mapa de rutas y dependencias
```

### Conceptos Clave

- **`modules/`**: Cada subdirectorio aquí representa una característica de la aplicación (ej., `users`, `products`, `email`). Un módulo es autónomo y contiene toda la lógica relacionada con esa característica: su controlador, servicio, repositorio, rutas, DTOs y documentación de API.
- **`core/`**: Este directorio contiene código que es compartido entre todos los módulos pero que no es específico de un único dominio de negocio. Aquí se incluyen interfaces base, funciones de utilidad y constantes de toda la aplicación.
- **Flujo de Dependencias**: El flujo de dependencias está diseñado para ser unidireccional y mantener la separación de responsabilidades:
  - **Rutas** dependen de **Controladores**.
  - **Controladores** dependen de **Servicios**.
  - **Servicios** dependen de **Repositorios**.
  - **Repositorios** manejan interacciones externas directas (como consultas a bases de datos o llamadas a APIs de terceros).

## 🚀 Cómo Agregar un Nuevo Módulo

1.  **Crea una nueva carpeta** en `src/modules/` (por ejemplo, `src/modules/usuarios`).
2.  **Agrega los archivos necesarios** dentro de tu nueva carpeta de módulo:
    - `usuarios.controller.ts` (maneja solicitudes y respuestas HTTP).
    - `usuarios.service.ts` (contiene la lógica de negocio).
    - `usuarios.repository.ts` (maneja el acceso a datos).
    - `usuarios.routes.ts` (define los endpoints de la API para el módulo).
    - `docs/usuarios.swagger.ts` (documentación de la API para los endpoints).
3.  **Define la ruta** en `src/routes/routes.ts`:

    ```typescript
    // src/routes/routes.ts
    import { UsuariosController } from "../modules/usuarios/usuarios.controller";
    import { UsuariosService } from "../modules/usuarios/usuarios.service";
    import { UsuariosRepository } from "../modules/usuarios/usuarios.repository";
    import { UsuariosRouter } from "../modules/usuarios/usuarios.routes";

    export const routes: IRoute[] = [
      // ... otras rutas
      {
        path: "/usuarios",
        router: UsuariosRouter,
        controller: UsuariosController,
        dependencies: [UsuariosService, UsuariosRepository], // El orden es importante para la inyección manual
      },
    ];
    ```

4.  **Conecta las dependencias** en `src/routes/index.ts` si tu módulo tiene dependencias anidadas (como un servicio que necesita un repositorio).

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

    Crea un archivo `.env` a partir del ejemplo:

    ```bash
    cp .env.example .env
    ```

    Luego, edita `.env` con tus configuraciones:

    ```env
    PORT=4000
    NODE_ENV=development
    CORS_ORIGIN=*

    # Configuración de Correo Electrónico
    MAILER_SERVICE=gmail
    MAILER_EMAIL=tu-email@gmail.com
    MAILER_SECRET_KEY=tu-contraseña-de-aplicación
    ```

4.  **Ejecuta en modo desarrollo**
    ```bash
    npm run dev
    ```

## 📜 Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo con recarga en caliente.
- `npm run build`: Compila el código TypeScript a JavaScript.
- `npm start`: Ejecuta la aplicación compilada en producción.
- `npm test`: Ejecuta todas las pruebas (unitarias y de integración).
- `npm run test:unit`: Ejecuta solo las pruebas unitarias.
- `npm run test:integration`: Ejecuta solo las pruebas de integración.
- `npm run test:coverage`: Genera un informe de cobertura de código.
- `npm run lint`: Ejecuta ESLint en el código fuente.
- `npm run lint:fix`: Corrige automáticamente los errores de ESLint.
- `npm run type-check`: Ejecuta el compilador de TypeScript para verificar errores de tipos.

## 🔧 Configuración

### Variables de Entorno

| Variable            | Descripción                   | Requerido | Valor por defecto |
| ------------------- | ----------------------------- | --------- | ---------------- |
| `PORT`              | Puerto del servidor           | No        | 4000             |
| `DEVELOPMENT`       | Entorno de ejecución          | No        | development      |
| `CORS_ORIGIN`       | Orígenes permitidos para CORS | No        | `*`              |
| `MAILER_SERVICE`    | Proveedor de servicio de email| Sí        | -                |
| `MAILER_EMAIL`      | Dirección de correo del remitente | Sí   | -                |
| `MAILER_SECRET_KEY` | Contraseña específica de la aplicación | Sí | -           |

### TypeScript

El proyecto utiliza TypeScript 5.x con configuraciones estrictas habilitadas para garantizar alta calidad de código y mantenibilidad.

### ESLint

ESLint está configurado con reglas modernas para TypeScript para hacer cumplir las mejores prácticas y la consistencia del código.

## 🧪 Pruebas

- **Jest**: Utilizado como marco de pruebas principal.
- **Supertest**: Para realizar solicitudes HTTP en pruebas de integración.
- **Cobertura de Código**: Los informes se generan a través del proveedor de cobertura de Jest.
- **Separación Clara**: Las pruebas unitarias (`/unit`) y de integración (`/integration`) se mantienen separadas.

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
```

## 🔒 Seguridad

- **Helmet**: Ayuda a proteger la aplicación Express configurando varias cabeceras HTTP.
- **CORS**: Configurado para gestionar el Intercambio de Recursos de Origen Cruzado.

## 🚀 Despliegue

### Construcción para Producción

1.  **Construye el proyecto**

    ```bash
    npm run build
    ```

2.  **Configure production environment variables**

3.  **Start the server**
    ```bash
    npm start
    ```
