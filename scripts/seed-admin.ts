import { UserService } from "../src/application/user.service";
import { RepositoryFactory } from "../src/infrastructure/persistence/repository.factory";
import { UserRole } from "../src/domain/entities/user.entity";
import crypto from "crypto";

async function seedAdmin() {
  try {
    console.log("🌱 Starting admin user seed...");

    const userService = new UserService();

    // Datos del administrador
    const adminData = {
      email: "admin@example.com",
      username: "admin",
      password: "admin123456",
      firstName: "System",
      lastName: "Administrator",
      roles: ["admin"] as UserRole[],
    };

    // Verificar si el administrador ya existe
    const existingAdmin = await userService.getUserByEmail(adminData.email);

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Username: ${existingAdmin.username}`);
      console.log(`🔑 Roles: ${existingAdmin.roles.join(", ")}`);
      return;
    }

    // Crear el administrador
    const admin = await userService.createUser(adminData);

    console.log("✅ Admin user created successfully!");
    console.log(`📧 Email: ${admin.email}`);
    console.log(`👤 Username: ${admin.username}`);
    console.log(`🔑 Roles: ${admin.roles.join(", ")}`);
    console.log(`🆔 ID: ${admin.id}`);

    console.log("\n🔐 Login credentials:");
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    process.exit(1);
  }
}

// Ejecutar el seed
seedAdmin()
  .then(() => {
    console.log("🎉 Admin seed completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Admin seed failed:", error);
    process.exit(1);
  });
