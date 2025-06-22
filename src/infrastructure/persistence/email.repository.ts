import nodemailer, { Transporter } from "nodemailer";
import { envs } from "../config/environment";
import { EmailOptions } from "../../application/dtos/emailOptions.dto";

export class EmailRepository {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: envs.mailerService,
      auth: {
        user: envs.mailerEmail,
        pass: envs.mailerSecretKey,
      },
    });
  }

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

      console.log("Email sent successfully");
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }
}
