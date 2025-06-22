import { EmailOptions } from "../../application/dtos/emailOptions.dto";

export interface IEmailService {
  sendEmail(options: EmailOptions): Promise<boolean>;
}
