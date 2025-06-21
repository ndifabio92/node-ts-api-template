import nodemailer, { Transporter } from "nodemailer";
import { envs } from "../../config/environment";
import { EmailOptions } from "./dtos/emailOptions.dto";

export class EmailService {
  private readonly transporter: Transporter = nodemailer.createTransport({
    service: envs.mailerService,
    auth: {
      user: envs.mailerEmail,
      pass: envs.mailerSecretKey,
    },
  });

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: envs.mailerEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
