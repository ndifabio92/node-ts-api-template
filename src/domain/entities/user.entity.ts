export type UserRole = "admin" | "user" | "moderator";

export interface User {
  id?: string;
  email: string;
  username: string;
  password: string;
  firstName?: string | undefined;
  lastName?: string | undefined;
  isActive: boolean;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  roles?: UserRole[];
}

export interface UpdateUserDto {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  roles?: UserRole[];
}

export interface AddRoleDto {
  role: UserRole;
}

export interface RemoveRoleDto {
  role: UserRole;
}
