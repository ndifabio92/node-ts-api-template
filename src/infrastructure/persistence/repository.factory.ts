import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { IAuthRepository } from "../../domain/interfaces/IAuthRepository";
import { UserMongoDbRepository } from "./mongodb/repositories/user.mongodb.repository";
import { AuthMongoDbRepository } from "./mongodb/repositories/auth.mongodb.repository";
import { UserPostgreSqlRepository } from "./postgresql/repositories/user.postgresql.repository";
import { AuthPostgreSqlRepository } from "./postgresql/repositories/auth.postgresql.repository";
import { envs } from "../config/environment";

export type DatabaseType = "mongodb" | "postgresql";

export class RepositoryFactory {
  private static databaseType: DatabaseType =
    (envs.databaseType as DatabaseType) || "mongodb";

  static setDatabaseType(type: DatabaseType): void {
    this.databaseType = type;
  }

  static getUserRepository(): IUserRepository {
    switch (this.databaseType) {
      case "mongodb":
        return new UserMongoDbRepository();
      case "postgresql":
        return new UserPostgreSqlRepository();
      default:
        throw new Error(`Unsupported database type: ${this.databaseType}`);
    }
  }

  static getAuthRepository(): IAuthRepository {
    switch (this.databaseType) {
      case "mongodb":
        return new AuthMongoDbRepository();
      case "postgresql":
        return new AuthPostgreSqlRepository();
      default:
        throw new Error(`Unsupported database type: ${this.databaseType}`);
    }
  }

  static getDatabaseType(): DatabaseType {
    return this.databaseType;
  }
}
