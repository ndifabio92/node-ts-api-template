// Mock nodemailer antes de que se importe cualquier módulo
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn(),
  }),
}));
