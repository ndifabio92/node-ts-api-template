import { Request, Response } from "express";
import { EmailController } from "../../../src/controllers/email.controller";
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../../../src/shared/constants";

describe("EmailController", () => {
  let emailController: EmailController;
  let mockEmailService: { sendEmail: jest.Mock };
  let mockRequest: Partial<Request>;
  let mockResponse: { status: jest.Mock; json: jest.Mock };

  beforeEach(() => {
    // Mock del servicio de email
    mockEmailService = {
      sendEmail: jest.fn(),
    };

    // Instancia del controlador con el mock del servicio
    emailController = new EmailController(mockEmailService as any);

    // Mock de la respuesta HTTP
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Datos de prueba para la solicitud
    mockRequest = {
      body: {
        to: "test@example.com",
        subject: "Test Subject",
        text: "This is a test email",
        html: "<p>This is a test email</p>",
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("sendEmail", () => {
    it("debe enviar email exitosamente y retornar success: true", async () => {
      // Configurar el mock para devolver éxito
      mockEmailService.sendEmail.mockResolvedValue(true);

      // Llamar al método del controlador
      await emailController.sendEmail(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      // Verificaciones
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(mockRequest.body);
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: SUCCESS_MESSAGES.EMAIL_SENT,
        data: { sent: true },
      });
    });

    it("debe manejar error del servicio y retornar success: false", async () => {
      // Configurar el mock para devolver error
      mockEmailService.sendEmail.mockResolvedValue(false);

      // Llamar al método del controlador
      await emailController.sendEmail(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      // Verificaciones
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(mockRequest.body);
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: ERROR_MESSAGES.EMAIL_SEND_ERROR,
        message: "An unexpected error occurred.",
      });
    });

    it("debe manejar excepción del servicio", async () => {
      // Configurar el mock para lanzar una excepción
      const error = new Error("Service error");
      mockEmailService.sendEmail.mockRejectedValue(error);

      // Llamar al método del controlador
      await emailController.sendEmail(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      // Verificar que se llamó al servicio
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(mockRequest.body);
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1);
      // Debería haber llamado a res.json con error
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: ERROR_MESSAGES.EMAIL_SEND_ERROR,
        message: "An unexpected error occurred.",
      });
    });

    it("debe validar campos requeridos", async () => {
      // Datos de prueba sin campos requeridos
      mockRequest.body = {
        to: "test@example.com",
        // Falta subject y html
      };

      // Llamar al método del controlador
      await emailController.sendEmail(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      // Verificar que no se llamó al servicio
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
      // Debería haber llamado a res.json con error de validación
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "subject: Required; html: Required",
      });
    });

    it("debe pasar correctamente los datos del body al servicio", async () => {
      // Configurar el mock
      mockEmailService.sendEmail.mockResolvedValue(true);

      // Datos de prueba más complejos
      const complexEmailData = {
        to: ["user1@example.com", "user2@example.com"],
        subject: "Complex Test Subject",
        text: "Plain text content",
        html: "<h1>HTML content</h1><p>Complex email</p>",
        attachments: [{ filename: "test.txt", path: "/path/to/file.txt" }],
      };

      mockRequest.body = complexEmailData;

      // Llamar al método del controlador
      await emailController.sendEmail(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      // Verificar que se pasaron exactamente los mismos datos
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(complexEmailData);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: SUCCESS_MESSAGES.EMAIL_SENT,
        data: { sent: true },
      });
    });
  });
});
