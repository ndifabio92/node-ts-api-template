# Configuración Inicial

## 🔧 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Server Configuration
PORT=4000
DEVELOPMENT=true
CORS_ORIGIN=http://localhost:3000

# Email Configuration
MAILER_SERVICE=gmail
MAILER_EMAIL=your-email@gmail.com
MAILER_SECRET_KEY=your-app-password

# Database Configuration
DATABASE_TYPE=mongodb
DATABASE_URL=postgresql://user:password@localhost:5432/myapp

# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
MONGO_DB=myapp
MONGO_USER=user
MONGO_PASSWORD=password

# PostgreSQL Configuration
POSTGRES_DB=myapp
POSTGRES_USER=user
POSTGRES_PASSWORD=password

# JWT Configuration (¡IMPORTANTE! Cambia estos valores en producción)
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_REFRESH_SECRET=your-super-secure-jwt-refresh-secret-key
```

## 🚀 Configuración Rápida

### Para MongoDB:

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
# DATABASE_TYPE=mongodb

# 3. Ejecutar la aplicación
npm run dev
```

### Para PostgreSQL:

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
# DATABASE_TYPE=postgresql
# DATABASE_URL=postgresql://user:password@localhost:5432/myapp

# 3. Configurar base de datos
npm run db:setup

# 4. Poblar con datos de ejemplo (opcional)
npm run db:seed

# 5. Ejecutar la aplicación
npm run dev
```

## 📊 Scripts Disponibles

```bash
# Base de datos
npm run db:generate    # Generar cliente Prisma
npm run db:migrate     # Crear migraciones
npm run db:setup       # Configurar BD completa
npm run db:seed        # Poblar con datos
npm run db:studio      # Abrir Prisma Studio
npm run db:reset       # Resetear BD

# Desarrollo
npm run dev            # Desarrollo con hot reload
npm run build          # Compilar TypeScript
npm run start          # Ejecutar producción
npm run test           # Ejecutar tests
npm run lint           # Linting
```

## 🔍 Verificación

Para verificar que todo funciona correctamente:

1. **MongoDB**: La aplicación se conectará automáticamente usando `MongoConnection`
2. **PostgreSQL**: Ejecuta `npm run db:setup` y verifica la conexión usando `PrismaConnection`
3. **Prisma Studio**: Ejecuta `npm run db:studio` para ver la interfaz visual

## 🏗️ Estructura de Configuración

### Configuraciones de Base de Datos

```
src/infrastructure/config/database/
├── mongo.config.ts      # Configuración MongoDB
└── prisma.config.ts     # Configuración PostgreSQL
```

### Repositorios

```
src/infrastructure/persistence/
├── repository.factory.ts
├── mongodb/repositories/     # Repositorios MongoDB
└── postgresql/repositories/  # Repositorios PostgreSQL
```

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL:

- Verifica que PostgreSQL esté ejecutándose
- Confirma las credenciales en `DATABASE_URL`
- Ejecuta `npm run db:setup` para configurar la BD
- Verifica la configuración en `src/infrastructure/config/database/prisma.config.ts`

### Error de conexión a MongoDB:

- Verifica que MongoDB esté ejecutándose
- Confirma la URL en `MONGO_URL`
- Verifica la configuración en `src/infrastructure/config/database/mongo.config.ts`

### Error de Prisma:

- Ejecuta `npm run db:generate` para regenerar el cliente
- Verifica que el schema esté correcto en `prisma/schema.prisma`
- Confirma que `DATABASE_URL` esté configurado correctamente

## 🔄 Cambio de Base de Datos

Para cambiar entre MongoDB y PostgreSQL:

1. **Cambiar variable de entorno**:

   ```env
   DATABASE_TYPE=postgresql  # o 'mongodb'
   ```

2. **O cambiar programáticamente**:

   ```typescript
   RepositoryFactory.setDatabaseType("postgresql");
   ```

3. **El código de negocio permanece igual**:
   ```typescript
   const userService = new UserService(); // Transparente a la BD
   ```
