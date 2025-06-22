import { Request, Response } from "express";
import { EmailController } from "../../../src/infrastructure/web/controllers/email.controller";
import { EmailService } from "../../../src/application/email.service";
import { SUCCESS_MESSAGES } from "../../../src/infrastructure/shared/constants";

// Mock the EmailService
jest.mock("../../../src/application/email.service");

describe("EmailController", () => {
  let emailController: EmailController;
  let mockEmailService: jest.Mocked<EmailService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create a new mocked instance of the service
    mockEmailService = new EmailService({} as any) as jest.Mocked<EmailService>;

    // Create a new instance of the controller with the mocked service
    emailController = new EmailController(mockEmailService);

    // Mock the Express Response object
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };

    // Mock the Express Request object
    mockRequest = {
      body: {
        to: "test@example.com",
        subject: "Test Subject",
        html: "<h1>This is a test email</h1>",
      },
    };
  });

  describe("sendEmail", () => {
    it("should send an email successfully and return a success response", async () => {
      // Arrange
      mockEmailService.sendEmail.mockResolvedValue(true);

      // Act
      await emailController.sendEmail(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(mockRequest.body);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: { sent: true },
        message: SUCCESS_MESSAGES.EMAIL_SENT,
      });
    });

    it("should return an internal server error if the service fails to send the email", async () => {
      // Arrange
      mockEmailService.sendEmail.mockResolvedValue(false);

      // Act
      await emailController.sendEmail(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(mockRequest.body);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Internal Server Error",
      });
    });

    it("should handle exceptions from the service and return an internal server error", async () => {
      // Arrange
      const error = new Error("Service exploded");
      mockEmailService.sendEmail.mockRejectedValue(error);

      // Act
      await emailController.sendEmail(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Service exploded",
      });
    });

    it("should return a bad request error for invalid input data", async () => {
      // Arrange
      mockRequest.body = { to: "not-an-email" }; // Invalid body

      // Act
      await emailController.sendEmail(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.any(String), // Zod's error message can be complex
        })
      );
    });
  });
});
