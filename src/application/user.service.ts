import { IUserRepository } from "../domain/interfaces/IUserRepository";
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserRole,
  AddRoleDto,
  RemoveRoleDto,
} from "../domain/entities/user.entity";
import { RepositoryFactory } from "../infrastructure/persistence/repository.factory";

export class UserService {
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository = RepositoryFactory.getUserRepository();
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const existingUsername = await this.userRepository.findByUsername(
      userData.username
    );
    if (existingUsername) {
      throw new Error("Username already taken");
    }

    // Establecer roles por defecto si no se proporcionan
    const userWithRoles = {
      ...userData,
      roles: userData.roles || ["user"],
    };

    return await this.userRepository.create(userWithRoles);
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findByUsername(username);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return await this.userRepository.findByRole(role);
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<User | null> {
    // Verificar si el usuario existe
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Si se está actualizando el email, verificar que no exista
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await this.userRepository.exists(userData.email);
      if (emailExists) {
        throw new Error("Email already in use");
      }
    }

    return await this.userRepository.update(id, userData);
  }

  async deleteUser(id: string): Promise<boolean> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    return await this.userRepository.delete(id);
  }

  async addRole(userId: string, roleData: AddRoleDto): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.roles.includes(roleData.role)) {
      throw new Error("User already has this role");
    }

    const updatedRoles = [...user.roles, roleData.role];
    return await this.userRepository.update(userId, { roles: updatedRoles });
  }

  async removeRole(
    userId: string,
    roleData: RemoveRoleDto
  ): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.roles.includes(roleData.role)) {
      throw new Error("User does not have this role");
    }

    // No permitir remover el último rol de admin
    if (
      roleData.role === "admin" &&
      user.roles.filter((r) => r === "admin").length === 1
    ) {
      throw new Error("Cannot remove the last admin role");
    }

    const updatedRoles = user.roles.filter((role) => role !== roleData.role);
    return await this.userRepository.update(userId, { roles: updatedRoles });
  }

  async hasRole(userId: string, role: UserRole): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return false;
    }
    return user.roles.includes(role);
  }

  async hasAnyRole(userId: string, roles: UserRole[]): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return false;
    }
    return roles.some((role) => user.roles.includes(role));
  }

  async userExists(email: string): Promise<boolean> {
    return await this.userRepository.exists(email);
  }
}
