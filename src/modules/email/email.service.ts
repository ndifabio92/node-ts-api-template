import { EmailOptions } from "./dtos/emailOptions.dto";
import { EmailRepository } from "./email.repository";

export class EmailService {
  private readonly _emailRepository: EmailRepository;

  constructor(emailRepository: EmailRepository) {
    this._emailRepository = emailRepository;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      return await this._emailRepository.sendEmail(options);
    } catch (error) {
      throw error;
    }
  }
}
