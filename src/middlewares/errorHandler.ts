import { Request, Response, NextFunction } from "express";
import { HttpResponse } from "../shared/utils/httpResponse";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class ErrorHandler {
  static handle(
    error: AppError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.error("Error:", error);

    // Si ya se envió una respuesta, pasar al siguiente middleware
    if (res.headersSent) {
      return next(error);
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    // En desarrollo, incluir stack trace
    const errorResponse: any = {
      success: false,
      message,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    };

    return res.status(statusCode).json(errorResponse);
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
