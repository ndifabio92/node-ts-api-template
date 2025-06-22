#!/usr/bin/env tsx

import { execSync } from "child_process";
import { PrismaConnection } from "../src/infrastructure/config/database/prisma.config";

async function setupDatabase() {
  console.log("🚀 Configurando base de datos...");

  try {
    // Generar el cliente de Prisma
    console.log("📦 Generando cliente de Prisma...");
    execSync("npx prisma generate", { stdio: "inherit" });

    // Crear y aplicar migraciones
    console.log("🔄 Aplicando migraciones...");
    execSync("npx prisma migrate dev --name init", { stdio: "inherit" });

    // Verificar conexión
    console.log("🔍 Verificando conexión...");
    await PrismaConnection.connect({ databaseUrl: process.env.DATABASE_URL! });
    const isHealthy = await PrismaConnection.healthCheck();

    if (isHealthy) {
      console.log("✅ Base de datos configurada exitosamente!");
    } else {
      console.error("❌ Error en la verificación de la base de datos");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error configurando la base de datos:", error);
    process.exit(1);
  } finally {
    await PrismaConnection.disconnect();
  }
}

setupDatabase();
