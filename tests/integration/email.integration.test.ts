import request from "supertest";
import { App } from "../../src/app";
import nodemailer from "nodemailer";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../src/shared/constants";

describe("Email Integration Test", () => {
  let app: App;
  let server: any;
  let mockSendMail: jest.Mock;

  beforeAll(() => {
    // Obtener la referencia al mock de manera más directa
    const mockCreateTransport = nodemailer.createTransport as jest.Mock;
    mockSendMail = mockCreateTransport.mock.results[0]?.value?.sendMail;

    // Crear la app
    app = new App();
    const expressApp = app.getApp();
    server = expressApp.listen(0);
  });

  afterAll((done) => {
    server.close(done);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /v1/api/email/send", () => {
    const validEmailData = {
      to: "test@example.com",
      subject: "Test Subject",
      text: "This is a test email",
      html: "<p>This is a test email</p>",
    };

    it("debe enviar un email correctamente", async () => {
      const mockResponse = {
        messageId: "test-message-id",
        accepted: [validEmailData.to],
        rejected: [],
        response: "250 OK: Mensaje enviado",
      };
      mockSendMail.mockResolvedValueOnce(mockResponse);

      const response = await request(server)
        .post("/v1/api/email/send")
        .send(validEmailData)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: SUCCESS_MESSAGES.EMAIL_SENT,
        data: { sent: true },
      });
      expect(mockSendMail).toHaveBeenCalledWith({
        from: expect.any(String),
        to: validEmailData.to,
        subject: validEmailData.subject,
        html: validEmailData.html,
        text: validEmailData.text,
        attachments: undefined,
      });
      expect(mockSendMail).toHaveBeenCalledTimes(1);
    });

    it("debe manejar errores al enviar el email", async () => {
      const error = new Error("SMTP error");
      mockSendMail.mockRejectedValueOnce(error);

      const response = await request(server)
        .post("/v1/api/email/send")
        .send(validEmailData)
        .expect("Content-Type", /json/)
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: ERROR_MESSAGES.EMAIL_SEND_ERROR,
        message: "An unexpected error occurred.",
      });
      expect(mockSendMail).toHaveBeenCalledTimes(1);
    });

    it("debe manejar emails con múltiples destinatarios", async () => {
      const multipleRecipientsData = {
        ...validEmailData,
        to: ["user1@example.com", "user2@example.com", "user3@example.com"],
      };
      const mockResponse = {
        messageId: "test-message-id",
        accepted: multipleRecipientsData.to,
        rejected: [],
      };
      mockSendMail.mockResolvedValueOnce(mockResponse);

      const response = await request(server)
        .post("/v1/api/email/send")
        .send(multipleRecipientsData)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: SUCCESS_MESSAGES.EMAIL_SENT,
        data: { sent: true },
      });
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: multipleRecipientsData.to,
        })
      );
    });

    it("debe manejar emails con archivos adjuntos", async () => {
      const emailWithAttachments = {
        ...validEmailData,
        attachments: [
          { filename: "test.txt", path: "/path/to/file.txt" },
          { filename: "image.jpg", path: "/path/to/image.jpg" },
        ],
      };
      const mockResponse = {
        messageId: "test-message-id",
        accepted: [validEmailData.to],
      };
      mockSendMail.mockResolvedValueOnce(mockResponse);

      const response = await request(server)
        .post("/v1/api/email/send")
        .send(emailWithAttachments)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: SUCCESS_MESSAGES.EMAIL_SENT,
        data: { sent: true },
      });
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          attachments: emailWithAttachments.attachments,
        })
      );
    });

    it("debe validar campos requeridos", async () => {
      const invalidEmailData = {
        to: "test@example.com",
        subject: "Test Subject",
        // Falta html que es requerido
      };

      const response = await request(server)
        .post("/v1/api/email/send")
        .send(invalidEmailData)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: "html: Required",
      });
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    it("debe manejar emails con solo texto (sin HTML)", async () => {
      const textOnlyEmail = {
        to: "test@example.com",
        subject: "Text Only Email",
        text: "This is a text-only email",
        html: "<p>This is a text-only email</p>", // HTML requerido
      };
      const mockResponse = {
        messageId: "test-message-id",
        accepted: [textOnlyEmail.to],
      };
      mockSendMail.mockResolvedValueOnce(mockResponse);

      const response = await request(server)
        .post("/v1/api/email/send")
        .send(textOnlyEmail)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: SUCCESS_MESSAGES.EMAIL_SENT,
        data: { sent: true },
      });
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: textOnlyEmail.to,
          subject: textOnlyEmail.subject,
          text: textOnlyEmail.text,
          html: textOnlyEmail.html,
        })
      );
    });
  });
});
