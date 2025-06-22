import { IUserRepository } from "../../../../domain/interfaces/IUserRepository";
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserRole,
} from "../../../../domain/entities/user.entity";
import { UserModel, UserDocument } from "../models/user.model";

export class UserMongoDbRepository implements IUserRepository {
  async create(user: CreateUserDto): Promise<User> {
    const newUser = new UserModel({
      ...user,
      isActive: true,
    });

    const savedUser = await newUser.save();
    return this.mapToDomain(savedUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user ? this.mapToDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    return user ? this.mapToDomain(user) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await UserModel.findOne({ username });
    return user ? this.mapToDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await UserModel.find();
    return users.map((user) => this.mapToDomain(user));
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const users = await UserModel.find({ roles: role });
    return users.map((user) => this.mapToDomain(user));
  }

  async update(id: string, userData: UpdateUserDto): Promise<User | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { ...userData, updatedAt: new Date() },
      { new: true }
    );
    return updatedUser ? this.mapToDomain(updatedUser) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }

  async exists(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({
      email: email.toLowerCase(),
    });
    return count > 0;
  }

  private mapToDomain(userDoc: UserDocument): User {
    return {
      id: (userDoc._id as any).toString(),
      email: userDoc.email,
      username: userDoc.username,
      password: userDoc.password,
      firstName: userDoc.firstName || undefined,
      lastName: userDoc.lastName || undefined,
      isActive: userDoc.isActive,
      roles: userDoc.roles,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    };
  }
}
