import { PrismaClient } from "../../../generated/prisma";

interface ConnectionOptions {
  databaseUrl: string;
}

class PrismaClientSingleton {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
      });
    }
    return PrismaClientSingleton.instance;
  }

  public static async disconnect(): Promise<void> {
    if (PrismaClientSingleton.instance) {
      await PrismaClientSingleton.instance.$disconnect();
    }
  }
}

export class PrismaConnection {
  private static prisma = PrismaClientSingleton.getInstance();

  static async connect(options: ConnectionOptions) {
    try {
      await this.prisma.$connect();
      console.log("PostgreSQL Connected via Prisma");
    } catch (error) {
      console.log("PostgreSQL connection error");
      throw error;
    }
  }

  static async disconnect() {
    try {
      await PrismaClientSingleton.disconnect();
      console.log("PostgreSQL Disconnected");
    } catch (error) {
      console.log("PostgreSQL disconnection error");
      throw error;
    }
  }

  static async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error("PostgreSQL health check failed:", error);
      return false;
    }
  }

  static getClient(): PrismaClient {
    return this.prisma;
  }
}
