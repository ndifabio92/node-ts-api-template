import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../../application/auth.service";
import { HttpResponse } from "../../shared/utils/httpResponse";
import { envs } from "../../config/environment";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export class AuthMiddleware {
  private static authService = new AuthService();

  static async authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        HttpResponse.unauthorized(res, "Access token required");
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      try {
        // Verificar JWT directamente
        const decoded = jwt.verify(token, envs.jwtSecret) as any;

        if (decoded.type !== "access") {
          HttpResponse.unauthorized(res, "Invalid token type");
          return;
        }

        // Verificar que el token existe en la base de datos (opcional para access tokens)
        const authToken = await AuthMiddleware.authService.validateToken(token);
        if (!authToken) {
          HttpResponse.unauthorized(res, "Token not found in database");
          return;
        }

        // Get user information
        const userService = new (
          await import("../../../application/user.service")
        ).UserService();
        const user = await userService.getUserById(decoded.userId);

        if (!user || !user.isActive) {
          HttpResponse.unauthorized(res, "User not found or inactive");
          return;
        }

        // Attach user to request
        req.user = {
          id: user.id!,
          email: user.email,
          username: user.username,
        };

        next();
      } catch (jwtError) {
        HttpResponse.unauthorized(res, "Invalid or expired access token");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      HttpResponse.internalServer(res, "Authentication failed", error);
    }
  }

  static async optionalAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);

        try {
          // Verificar JWT directamente
          const decoded = jwt.verify(token, envs.jwtSecret) as any;

          if (decoded.type === "access") {
            const userService = new (
              await import("../../../application/user.service")
            ).UserService();
            const user = await userService.getUserById(decoded.userId);

            if (user && user.isActive) {
              req.user = {
                id: user.id!,
                email: user.email,
                username: user.username,
              };
            }
          }
        } catch (jwtError) {
          // Continue without authentication if JWT is invalid
        }
      }

      next();
    } catch (error) {
      // Continue without authentication if there's an error
      next();
    }
  }
}
