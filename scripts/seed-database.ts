#!/usr/bin/env tsx

import { PrismaConnection } from "../src/infrastructure/config/database/prisma.config";
import { UserService } from "../src/application/user.service";
import { AuthService } from "../src/application/auth.service";
import { RepositoryFactory } from "../src/infrastructure/persistence/repository.factory";
import { envs } from "../src/infrastructure/config/environment";

async function seedDatabase() {
  console.log("🌱 Poblando base de datos con datos de ejemplo...");

  try {
    // Verificar que estamos usando PostgreSQL
    if (RepositoryFactory.getDatabaseType() !== "postgresql") {
      console.log(
        "⚠️ Este script está diseñado para PostgreSQL. Cambiando a PostgreSQL..."
      );
      RepositoryFactory.setDatabaseType("postgresql");
    }

    // Conectar a la base de datos
    await PrismaConnection.connect({ databaseUrl: envs.databaseUrl });

    // Verificar conexión
    const isHealthy = await PrismaConnection.healthCheck();
    if (!isHealthy) {
      throw new Error("Database connection failed");
    }

    // Crear servicios
    const userService = new UserService();
    const authService = new AuthService();

    // Datos de ejemplo
    const sampleUsers = [
      {
        email: "admin@example.com",
        username: "admin",
        password: "admin123",
        firstName: "Admin",
        lastName: "User",
      },
      {
        email: "john@example.com",
        username: "john_doe",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
      },
      {
        email: "jane@example.com",
        username: "jane_smith",
        password: "password123",
        firstName: "Jane",
        lastName: "Smith",
      },
    ];

    console.log("👥 Creando usuarios de ejemplo...");

    for (const userData of sampleUsers) {
      try {
        const result = await authService.register(userData);
        console.log(
          `✅ Usuario creado: ${result.user.email} (ID: ${result.user.id})`
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("already exists")
        ) {
          console.log(`⚠️ Usuario ya existe: ${userData.email}`);
        } else {
          console.error(`❌ Error creando usuario ${userData.email}:`, error);
        }
      }
    }

    // Mostrar estadísticas
    console.log("\n📊 Estadísticas de la base de datos:");
    const allUsers = await userService.getAllUsers();
    console.log(`- Total de usuarios: ${allUsers.length}`);

    console.log("\n🎉 Base de datos poblada exitosamente!");
    console.log("\n🔑 Credenciales de ejemplo:");
    console.log("- admin@example.com / admin123");
    console.log("- john@example.com / password123");
    console.log("- jane@example.com / password123");
  } catch (error) {
    console.error("❌ Error poblando la base de datos:", error);
    process.exit(1);
  } finally {
    await PrismaConnection.disconnect();
  }
}

seedDatabase();
