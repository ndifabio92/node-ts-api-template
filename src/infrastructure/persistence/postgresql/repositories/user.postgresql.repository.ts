import { IUserRepository } from "../../../../domain/interfaces/IUserRepository";
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserRole,
} from "../../../../domain/entities/user.entity";
import { PrismaConnection } from "../../../config/database/prisma.config";

export class UserPostgreSqlRepository implements IUserRepository {
  private prisma = PrismaConnection.getClient();

  async create(user: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        ...user,
        isActive: true,
        roles: user.roles || ["user"],
      },
    });

    return this.mapToDomain(newUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? this.mapToDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return user ? this.mapToDomain(user) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    return user ? this.mapToDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user: User) => this.mapToDomain(user));
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        roles: {
          has: role,
        },
      },
    });
    return users.map((user: User) => this.mapToDomain(user));
  }

  async update(id: string, userData: UpdateUserDto): Promise<User | null> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: userData,
    });
    return this.mapToDomain(updatedUser);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async exists(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.toLowerCase() },
    });
    return count > 0;
  }

  private mapToDomain(userEntity: any): User {
    return {
      id: userEntity.id,
      email: userEntity.email,
      username: userEntity.username,
      password: userEntity.password,
      firstName: userEntity.firstName || undefined,
      lastName: userEntity.lastName || undefined,
      isActive: userEntity.isActive,
      roles: userEntity.roles,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    };
  }
}
