import { Request, Response } from "express";
import { UserService } from "../../../application/user.service";
import {
  updateUserSchema,
  addRoleSchema,
  removeRoleSchema,
} from "../../../domain/schemas/user.schema";
import { HttpResponse } from "../../shared/utils/httpResponse";

export class UserController {
  private readonly _userService: UserService;

  constructor(userService: UserService) {
    this._userService = userService;
  }

  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this._userService.getAllUsers();

      return HttpResponse.success(res, {
        users: users.map((user) => ({
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          roles: user.roles,
          createdAt: user.createdAt,
        })),
      });
    } catch (error) {
      console.error("Get all users error:", error);
      return HttpResponse.internalServer(res, "Failed to get users", error);
    }
  }

  async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return HttpResponse.badRequest(res, "User ID is required");
      }

      const user = await this._userService.getUserById(id);

      if (!user) {
        return HttpResponse.notFound(res, "User not found");
      }

      return HttpResponse.success(res, {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          roles: user.roles,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error("Get user by ID error:", error);
      return HttpResponse.internalServer(res, "Failed to get user", error);
    }
  }

  async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return HttpResponse.badRequest(res, "User ID is required");
      }

      // Validar datos de entrada
      const validatedData = updateUserSchema.parse(req.body);

      // Convertir a UpdateUserDto
      const updateUserDto = {
        ...(validatedData.username && { username: validatedData.username }),
        ...(validatedData.email && { email: validatedData.email }),
        ...(validatedData.firstName && { firstName: validatedData.firstName }),
        ...(validatedData.lastName && { lastName: validatedData.lastName }),
        ...(validatedData.isActive !== undefined && {
          isActive: validatedData.isActive,
        }),
        ...(validatedData.roles && { roles: validatedData.roles }),
      };

      const updatedUser = await this._userService.updateUser(id, updateUserDto);

      if (!updatedUser) {
        return HttpResponse.notFound(res, "User not found");
      }

      return HttpResponse.success(
        res,
        {
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            username: updatedUser.username,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            isActive: updatedUser.isActive,
            roles: updatedUser.roles,
            createdAt: updatedUser.createdAt,
          },
        },
        "User updated successfully"
      );
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("already exists") ||
          error.message.includes("already taken") ||
          error.message.includes("already in use")
        ) {
          return HttpResponse.conflict(res, error.message);
        }
        if (error.message.includes("not found")) {
          return HttpResponse.notFound(res, error.message);
        }
      }

      console.error("Update user error:", error);
      return HttpResponse.internalServer(res, "Failed to update user", error);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return HttpResponse.badRequest(res, "User ID is required");
      }

      const deleted = await this._userService.deleteUser(id);

      if (!deleted) {
        return HttpResponse.notFound(res, "User not found");
      }

      return HttpResponse.success(res, null, "User deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          return HttpResponse.notFound(res, error.message);
        }
      }

      console.error("Delete user error:", error);
      return HttpResponse.internalServer(res, "Failed to delete user", error);
    }
  }

  async addRole(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return HttpResponse.badRequest(res, "User ID is required");
      }

      // Validar datos de entrada
      const validatedData = addRoleSchema.parse(req.body);

      const updatedUser = await this._userService.addRole(id, validatedData);

      if (!updatedUser) {
        return HttpResponse.notFound(res, "User not found");
      }

      return HttpResponse.success(
        res,
        {
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            username: updatedUser.username,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            isActive: updatedUser.isActive,
            roles: updatedUser.roles,
            createdAt: updatedUser.createdAt,
          },
        },
        "Role added successfully"
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          return HttpResponse.notFound(res, error.message);
        }
        if (
          error.message.includes("already has") ||
          error.message.includes("already assigned")
        ) {
          return HttpResponse.conflict(res, error.message);
        }
      }

      console.error("Add role error:", error);
      return HttpResponse.internalServer(res, "Failed to add role", error);
    }
  }

  async removeRole(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return HttpResponse.badRequest(res, "User ID is required");
      }

      // Validar datos de entrada
      const validatedData = removeRoleSchema.parse(req.body);

      const updatedUser = await this._userService.removeRole(id, validatedData);

      if (!updatedUser) {
        return HttpResponse.notFound(res, "User not found");
      }

      return HttpResponse.success(
        res,
        {
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            username: updatedUser.username,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            isActive: updatedUser.isActive,
            roles: updatedUser.roles,
            createdAt: updatedUser.createdAt,
          },
        },
        "Role removed successfully"
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          return HttpResponse.notFound(res, error.message);
        }
        if (
          error.message.includes("does not have") ||
          error.message.includes("not assigned")
        ) {
          return HttpResponse.badRequest(res, error.message);
        }
      }

      console.error("Remove role error:", error);
      return HttpResponse.internalServer(res, "Failed to remove role", error);
    }
  }
}
