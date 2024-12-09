# Node TS Api Template

## Developer

### App

1. **Create the `.env` file**  
   Copy the `.env.template` file to `.env` and configure the necessary environment variables. This file contains sensitive configurations and should be kept private.
   ```bash
   cp .env.template .env
   ```
   - Make sure to configure all the required environment variables in the `.env` file before starting the application.

### Docker Setup

1. **Start containers with Docker Compose**  
   Use `docker-compose` to start the containers in detached mode. This command will start all the services defined in your `docker-compose.yml` file.
   ```bash
   docker-compose up -d
   ```
   - This will start the database, server, and other services defined in your `docker-compose.yml` file.

### Prisma Setup

1. **Create a Migration**  
   Prisma uses migrations to manage changes to the database. To create an initial migration, run the following command:

   ```bash
   npx prisma migrate dev --name init
   ```

   - `--name init`: Specifies the name of the migration (in this case, "init" for the first migration).
   - This will generate a migration file in the `prisma/migrations` folder.

2. **Apply Migrations**  
   After creating the migration, apply it to the database with the following command:
   ```bash
   npx prisma migrate dev
   ```
   - This command syncs your database with the schema defined in Prisma. If you have multiple migrations, all will be applied.
