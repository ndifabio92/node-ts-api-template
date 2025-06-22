import { Response } from "express";
import { envs } from "../../config/environment";

interface IResponse {
  success: boolean;
  data?: any;
  message: string;
}

export class HttpResponse {
  static success(res: Response, data: any, message = "Success") {
    return res.status(200).json({ success: true, message, data });
  }

  static created(res: Response, data: any, message = "Created successfully") {
    return res.status(201).json({ success: true, message, data });
  }

  static badRequest(res: Response, message: string) {
    const response: IResponse = {
      success: false,
      message: message,
    };
    return res.status(400).json(response);
  }

  static unauthorized(res: Response, message = "Unauthorized") {
    return res.status(401).json({ success: false, message });
  }

  static forbidden(res: Response, message = "Forbidden", error = "CORS Error") {
    return res.status(403).json({ success: false, error, message });
  }

  static notFound(res: Response, message = "Not Found") {
    return res.status(404).json({ success: false, message });
  }

  static conflict(res: Response, message = "Conflict") {
    return res.status(409).json({ success: false, message });
  }

  static internalServer(
    res: Response,
    message = "An unexpected error occurred.",
    error?: any
  ) {
    const errorMsg =
      envs.development && error ? error.message : "Internal Server Error";

    const response: IResponse = {
      success: false,
      message: errorMsg,
    };
    return res.status(500).json(response);
  }
}
