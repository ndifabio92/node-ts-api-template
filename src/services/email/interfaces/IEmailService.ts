import { EmailOptions } from "../dtos/emailOptions.dto";

export interface IEmailService {
  sendEmail(options: EmailOptions): Promise<boolean>;
}
