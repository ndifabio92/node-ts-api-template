import { Request, Response } from "express";
import { AuthService } from "../../../application/auth.service";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../../../domain/schemas/auth.schema";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { HttpResponse } from "../../shared/utils/httpResponse";

export class AuthController {
  private readonly _authService: AuthService;

  constructor(authService: AuthService) {
    this._authService = authService;
  }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      // Validar datos de entrada
      const validatedData = registerSchema.parse(req.body);

      // Convertir a RegisterDto
      const registerDto = {
        email: validatedData.email,
        username: validatedData.username,
        password: validatedData.password,
        ...(validatedData.firstName && { firstName: validatedData.firstName }),
        ...(validatedData.lastName && { lastName: validatedData.lastName }),
      };

      // Registrar usuario
      const result = await this._authService.register(registerDto);

      return HttpResponse.created(
        res,
        {
          user: {
            id: result.user.id,
            email: result.user.email,
            username: result.user.username,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            isActive: result.user.isActive,
            roles: result.user.roles,
            createdAt: result.user.createdAt,
          },
          tokens: result.tokens,
        },
        "User registered successfully"
      );
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("already exists") ||
          error.message.includes("already taken")
        ) {
          return HttpResponse.conflict(res, error.message);
        }
      }

      console.error("Registration error:", error);
      return HttpResponse.internalServer(res, "Registration failed", error);
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      // Validar datos de entrada
      const validatedData = loginSchema.parse(req.body);

      // Iniciar sesión
      const result = await this._authService.login(validatedData);

      return HttpResponse.success(
        res,
        {
          user: {
            id: result.user.id,
            email: result.user.email,
            username: result.user.username,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            isActive: result.user.isActive,
            roles: result.user.roles,
            createdAt: result.user.createdAt,
          },
          tokens: result.tokens,
        },
        "Login successful"
      );
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("Invalid credentials") ||
          error.message.includes("deactivated")
        ) {
          return HttpResponse.unauthorized(res, error.message);
        }
      }

      console.error("Login error:", error);
      return HttpResponse.internalServer(res, "Login failed", error);
    }
  }

  async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      // Validar datos de entrada
      const validatedData = refreshTokenSchema.parse(req.body);

      // Renovar tokens
      const tokens = await this._authService.refreshToken(
        validatedData.refreshToken
      );

      return HttpResponse.success(
        res,
        { tokens },
        "Tokens refreshed successfully"
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Invalid or expired refresh token")) {
          return HttpResponse.unauthorized(res, error.message);
        }
      }

      console.error("Token refresh error:", error);
      return HttpResponse.internalServer(res, "Token refresh failed", error);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return HttpResponse.unauthorized(res, "Authentication required");
      }

      // Cerrar sesión
      await this._authService.logout(req.user.id);

      return HttpResponse.success(res, null, "Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      return HttpResponse.internalServer(res, "Logout failed", error);
    }
  }

  async me(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return HttpResponse.unauthorized(res, "Authentication required");
      }

      return HttpResponse.success(res, { user: req.user });
    } catch (error) {
      console.error("Get user info error:", error);
      return HttpResponse.internalServer(
        res,
        "Failed to get user information",
        error
      );
    }
  }
}
