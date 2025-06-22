import { Request, Response, NextFunction } from "express";
import { HttpResponse } from "../../shared/utils/httpResponse";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class ErrorHandler {
  public static handle(
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
  ) {
    console.error("Error:", err);

    // Si ya se envió una respuesta, pasar al siguiente middleware
    if (res.headersSent) {
      return _next(err);
    }

    // Use HttpResponse for a consistent error response format
    const message = err.message || "An internal server error occurred.";
    return HttpResponse.internalServer(res, message, err);
  }

  static createError(message: string, statusCode: number = 500): AppError {
    const error = new Error(message) as AppError;
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
  }

  static asyncHandler(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}
