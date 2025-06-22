import request from "supertest";
import { Server } from "http";
import { EmailRepository } from "../../src/infrastructure/persistence/email.repository";
import { App } from "../../src/infrastructure/web/app";
import { SUCCESS_MESSAGES } from "../../src/infrastructure/shared/constants";

// Mock the repository layer to prevent actual emails from being sent
jest.mock("../../src/infrastructure/persistence/email.repository");

describe("Email Module - Integration Tests", () => {
  let server: Server;
  let mockSendEmail: jest.SpyInstance;

  beforeAll((done) => {
    // Spy on the sendEmail method of the EmailRepository prototype
    mockSendEmail = jest.spyOn(EmailRepository.prototype, "sendEmail");

    // Create a new application instance for testing
    const api = new App();
    const app = api.getApp();
    server = app.listen(0, () => {
      done();
    }); // Listen on a random free port
  });

  afterAll((done) => {
    server.close(done);
  });

  afterEach(() => {
    // Clear mock history after each test
    mockSendEmail.mockClear();
  });

  describe("POST /v1/api/email/send", () => {
    const validEmailPayload = {
      to: "test@example.com",
      subject: "Test Subject",
      html: "<p>This is a test email</p>",
    };

    it("should return 200 OK and send an email successfully", async () => {
      // Arrange
      mockSendEmail.mockResolvedValue(true);

      // Act
      const response = await request(server)
        .post("/v1/api/email/send")
        .send(validEmailPayload);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: { sent: true },
        message: SUCCESS_MESSAGES.EMAIL_SENT,
      });
      expect(mockSendEmail).toHaveBeenCalledTimes(1);
      expect(mockSendEmail).toHaveBeenCalledWith(validEmailPayload);
    });

    it("should return 500 Internal Server Error when the repository fails to send", async () => {
      // Arrange
      mockSendEmail.mockResolvedValue(false); // Simulate a failure in the repository

      // Act
      const response = await request(server)
        .post("/v1/api/email/send")
        .send(validEmailPayload);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: "Internal Server Error",
      });
      expect(mockSendEmail).toHaveBeenCalledTimes(1);
    });

    it("should return 400 Bad Request for invalid payload (e.g., missing 'html')", async () => {
      // Arrange
      const invalidPayload = {
        to: "test@example.com",
        subject: "Test Subject",
      };

      // Act
      const response = await request(server)
        .post("/v1/api/email/send")
        .send(invalidPayload);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("html"); // Check that the error message mentions the missing field
      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("should return 400 Bad Request for invalid email format", async () => {
      // Arrange
      const invalidPayload = {
        to: "not-a-valid-email",
        subject: "Test Subject",
        html: "<p>test</p>",
      };

      // Act
      const response = await request(server)
        .post("/v1/api/email/send")
        .send(invalidPayload);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(mockSendEmail).not.toHaveBeenCalled();
    });
  });
});
