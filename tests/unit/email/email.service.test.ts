import { EmailService } from "../../../src/modules/email/email.service";
import { EmailRepository } from "../../../src/modules/email/email.repository";
import { EmailOptions } from "../../../src/modules/email/dtos/emailOptions.dto";

// Mock the EmailRepository
jest.mock("../../../src/modules/email/email.repository");

describe("EmailService", () => {
  let emailService: EmailService;
  let mockEmailRepository: jest.Mocked<EmailRepository>;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Create a new mocked instance of the repository
    mockEmailRepository = new EmailRepository() as jest.Mocked<EmailRepository>;

    // Create a new instance of the service with the mocked repository
    emailService = new EmailService(mockEmailRepository);
  });

  describe("sendEmail", () => {
    const mockEmailOptions: EmailOptions = {
      to: "test@example.com",
      subject: "Test Subject",
      html: "<h1>Test HTML</h1>",
    };

    it("should call the repository to send an email and return true on success", async () => {
      // Arrange
      mockEmailRepository.sendEmail.mockResolvedValue(true);

      // Act
      const result = await emailService.sendEmail(mockEmailOptions);

      // Assert
      expect(result).toBe(true);
      expect(mockEmailRepository.sendEmail).toHaveBeenCalledTimes(1);
      expect(mockEmailRepository.sendEmail).toHaveBeenCalledWith(
        mockEmailOptions
      );
    });

    it("should return false when the repository fails to send the email", async () => {
      // Arrange
      mockEmailRepository.sendEmail.mockResolvedValue(false);

      // Act
      const result = await emailService.sendEmail(mockEmailOptions);

      // Assert
      expect(result).toBe(false);
      expect(mockEmailRepository.sendEmail).toHaveBeenCalledTimes(1);
      expect(mockEmailRepository.sendEmail).toHaveBeenCalledWith(
        mockEmailOptions
      );
    });

    it("should propagate errors from the repository as a thrown exception", async () => {
      // Arrange
      const mockError = new Error("Repository failed");
      mockEmailRepository.sendEmail.mockRejectedValue(mockError);

      // Act & Assert
      await expect(emailService.sendEmail(mockEmailOptions)).rejects.toThrow(
        mockError
      );
      expect(mockEmailRepository.sendEmail).toHaveBeenCalledTimes(1);
    });
  });
});
