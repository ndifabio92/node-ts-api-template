# Arquitectura de Repositorios Transparentes

## 🎯 Objetivo

Esta arquitectura implementa el **Principio de Sustitución de Liskov** junto con el patrón **Repository** para crear un sistema donde los repositorios son transparentes a la base de datos utilizada. Esto permite cambiar entre MongoDB y PostgreSQL sin modificar el código de negocio.

## 🏗️ Estructura de la Arquitectura

```
src/
├── domain/                    # Capa de dominio (independiente de infraestructura)
│   ├── entities/             # Entidades de negocio
│   │   ├── user.entity.ts
│   │   └── auth.entity.ts
│   ├── interfaces/           # Contratos de repositorios
│   │   ├── IUserRepository.ts
│   │   └── IAuthRepository.ts
│   └── schemas/              # Validaciones de entrada
│       ├── user.schema.ts
│       └── auth.schema.ts
├── application/              # Capa de aplicación (lógica de negocio)
│   ├── user.service.ts
│   └── auth.service.ts
└── infrastructure/           # Capa de infraestructura (implementaciones)
    ├── config/               # Configuraciones
    │   ├── database/         # Configuraciones de base de datos
    │   │   ├── mongo.config.ts
    │   │   └── prisma.config.ts
    │   ├── environment.ts
    │   └── swagger.ts
    └── persistence/
        ├── repository.factory.ts    # Factory para elegir implementación
        ├── mongodb/                 # Implementación MongoDB
        │   ├── models/
        │   │   ├── user.model.ts
        │   │   └── auth.model.ts
        │   └── repositories/
        │       ├── user.mongodb.repository.ts
        │       └── auth.mongodb.repository.ts
        └── postgresql/              # Implementación PostgreSQL
            └── repositories/
                ├── user.postgresql.repository.ts
                └── auth.postgresql.repository.ts

prisma/
└── schema.prisma             # Schema de Prisma para PostgreSQL
```

## 🔄 Flujo de Datos

1. **Domain**: Define las entidades e interfaces
2. **Application**: Implementa la lógica de negocio usando las interfaces
3. **Infrastructure**: Proporciona implementaciones concretas
4. **Factory**: Selecciona la implementación correcta según configuración

## 🎛️ Configuración

### Variables de Entorno

```env
# Tipo de base de datos a usar
DATABASE_TYPE=mongodb  # o 'postgresql'

# Configuración MongoDB
MONGO_URL=mongodb://localhost:27017
MONGO_DB=myapp
MONGO_USER=user
MONGO_PASSWORD=password

# Configuración PostgreSQL (para Prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
POSTGRES_DB=myapp
POSTGRES_USER=user
POSTGRES_PASSWORD=password
```

### Cambio de Base de Datos

```typescript
// Cambiar en tiempo de ejecución
RepositoryFactory.setDatabaseType("postgresql");

// O cambiar la variable de entorno
// DATABASE_TYPE=postgresql
```

## 📝 Ejemplo de Uso

```typescript
import { UserService } from "./application/user.service";
import { AuthService } from "./application/auth.service";

// Los servicios son transparentes a la base de datos
const userService = new UserService();
const authService = new AuthService();

// Crear usuario (funciona con MongoDB o PostgreSQL)
const user = await userService.createUser({
  email: "user@example.com",
  username: "user123",
  password: "password123",
  firstName: "John",
  lastName: "Doe",
});

// Login (funciona con MongoDB o PostgreSQL)
const result = await authService.login({
  email: "user@example.com",
  password: "password123",
});
```

## 🚀 Scripts de Base de Datos

### PostgreSQL (Prisma)

```bash
# Generar cliente de Prisma
npm run db:generate

# Crear y aplicar migraciones
npm run db:migrate

# Configurar base de datos completa
npm run db:setup

# Poblar con datos de ejemplo
npm run db:seed

# Abrir Prisma Studio (interfaz visual)
npm run db:studio

# Resetear base de datos
npm run db:reset
```

### MongoDB

```bash
# MongoDB se configura automáticamente
# Solo asegúrate de que MONGO_URL esté configurado
```

## 🔧 Principios Aplicados

### 1. Principio de Sustitución de Liskov (LSP)

- Todas las implementaciones de repositorios son intercambiables
- El código cliente no necesita conocer la implementación específica

### 2. Inversión de Dependencias (DIP)

- Las capas superiores dependen de abstracciones (interfaces)
- Las implementaciones concretas dependen de las abstracciones

### 3. Separación de Responsabilidades (SRP)

- Cada repositorio tiene una única responsabilidad
- Los servicios manejan la lógica de negocio
- Los modelos manejan la persistencia

### 4. Abierto/Cerrado (OCP)

- Abierto para extensión (nuevas implementaciones)
- Cerrado para modificación (código existente no cambia)

## 🚀 Ventajas

1. **Flexibilidad**: Cambio fácil entre bases de datos
2. **Testabilidad**: Fácil mockeo de repositorios
3. **Mantenibilidad**: Código limpio y organizado
4. **Escalabilidad**: Fácil agregar nuevas implementaciones
5. **Independencia**: El dominio no depende de la infraestructura
6. **Type Safety**: Prisma proporciona tipado fuerte para PostgreSQL
7. **Consistencia**: Configuraciones de BD organizadas uniformemente

## 🧪 Testing

```typescript
// Mock del repositorio para testing
const mockUserRepository: IUserRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  // ... otros métodos
};

// Inyectar el mock
const userService = new UserService(mockUserRepository);
```

## 🔄 Migración

Para migrar de una base de datos a otra:

1. Cambiar `DATABASE_TYPE` en las variables de entorno
2. Asegurar que la nueva base de datos esté configurada
3. Ejecutar migraciones si es necesario (`npm run db:setup`)
4. El código de negocio permanece igual

## 📚 Tecnologías Utilizadas

- **MongoDB**: Mongoose ODM
- **PostgreSQL**: Prisma ORM
- **Validación**: Zod
- **Arquitectura**: Clean Architecture / Hexagonal Architecture
- **Patrones**: Repository, Factory, Dependency Injection

## 🔧 Configuración Inicial

### 1. Configurar variables de entorno

```env
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
```

### 2. Configurar base de datos

```bash
npm run db:setup
```

### 3. Poblar con datos de ejemplo

```bash
npm run db:seed
```

### 4. Ejecutar la aplicación

```bash
npm run dev
```

## 🏗️ Estructura de Configuración

### Configuraciones de Base de Datos

- `src/infrastructure/config/database/mongo.config.ts` - Configuración MongoDB
- `src/infrastructure/config/database/prisma.config.ts` - Configuración PostgreSQL

### Repositorios

- `src/infrastructure/persistence/mongodb/repositories/` - Repositorios MongoDB
- `src/infrastructure/persistence/postgresql/repositories/` - Repositorios PostgreSQL

### Factory

- `src/infrastructure/persistence/repository.factory.ts` - Selección de implementación
