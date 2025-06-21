import { EmailService } from "../../../src/services/email/email.service";
import nodemailer from "nodemailer";
import { EmailOptions } from "../../../src/services/email/dtos/emailOptions.dto";

// Mock nodemailer
jest.mock("nodemailer");

// Mock para la función createTransport
const mockCreateTransport = jest.spyOn(nodemailer, "createTransport");

// Mock para la función sendMail
const mockSendMail = jest.fn();

// Configuración del mock
const mockTransporter = {
  sendMail: mockSendMail,
};

// Configurar el mock para que devuelva nuestro transporter mockeado
mockCreateTransport.mockReturnValue(mockTransporter as any);

describe("EmailService", () => {
  let emailService: EmailService;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    emailService = new EmailService();
  });

  describe("sendEmail", () => {
    const mockEmailOptions: EmailOptions = {
      to: "test@example.com",
      subject: "Test Email",
      html: "<h1>Test Email</h1>",
      text: "Test Email",
    };

    it("debe enviar un correo electrónico exitosamente", async () => {
      // Preparar
      const mockResponse = {
        messageId: "test-message-id",
        accepted: [mockEmailOptions.to],
        rejected: [],
        envelopeTime: 100,
        messageTime: 200,
        response: "250 OK: Mensaje enviado",
      };
      mockSendMail.mockResolvedValueOnce(mockResponse);

      // Actuar
      const result = await emailService.sendEmail(mockEmailOptions);

      // Verificar
      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith({
        from: expect.any(String),
        to: mockEmailOptions.to,
        subject: mockEmailOptions.subject,
        html: mockEmailOptions.html,
        text: mockEmailOptions.text,
        attachments: undefined,
      });
    });

    it("debe manejar el error al enviar el correo", async () => {
      // Preparar
      const error = new Error("Error al enviar el correo");
      mockSendMail.mockRejectedValueOnce(error);

      // Actuar
      const result = await emailService.sendEmail(mockEmailOptions);

      // Verificar
      expect(result).toBe(false);
      expect(mockSendMail).toHaveBeenCalledWith({
        from: expect.any(String),
        to: mockEmailOptions.to,
        subject: mockEmailOptions.subject,
        html: mockEmailOptions.html,
        text: mockEmailOptions.text,
        attachments: undefined,
      });
    });

    it("debe enviar correo a múltiples destinatarios", async () => {
      // Preparar
      const multipleRecipients = ["test1@example.com", "test2@example.com"];
      const mockResponse = {
        messageId: "test-message-id",
        accepted: multipleRecipients,
        rejected: [],
      };
      mockSendMail.mockResolvedValueOnce(mockResponse);

      // Actuar
      const result = await emailService.sendEmail({
        ...mockEmailOptions,
        to: multipleRecipients,
      });

      // Verificar
      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: multipleRecipients,
        })
      );
    });

    it("debe manejar correos con archivos adjuntos", async () => {
      // Preparar
      const attachments = [
        { filename: "test.txt", path: "/ruta/al/archivo.txt" },
      ];
      const mockResponse = {
        messageId: "test-message-id",
        accepted: [mockEmailOptions.to],
      };
      mockSendMail.mockResolvedValueOnce(mockResponse);

      // Actuar
      const result = await emailService.sendEmail({
        ...mockEmailOptions,
        attachments,
      });

      // Verificar
      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          attachments,
        })
      );
    });
  });
});
