import { EmailService } from "../services/email/email.service";
import { Request, Response } from "express";
import { HttpResponse } from "../shared/utils/httpResponse";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../shared/constants";
import { sendEmailSchema } from "../services/email/schemas/email.schema";
import { EmailOptions } from "../services/email/dtos/emailOptions.dto";

export class EmailController {
  private readonly _emailService: EmailService;

  constructor(emailService: EmailService) {
    this._emailService = emailService;
  }

  async sendEmail(req: Request, res: Response) {
    try {
      const validationResult = sendEmailSchema.safeParse(req.body);

      if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        const errorMessage = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${messages?.join(", ")}`)
          .join("; ");

        return HttpResponse.badRequest(res, errorMessage);
      }

      const success = await this._emailService.sendEmail(
        validationResult.data as EmailOptions
      );

      if (success) {
        return HttpResponse.success(
          res,
          { sent: true },
          SUCCESS_MESSAGES.EMAIL_SENT
        );
      } else {
        return HttpResponse.internalServer(
          res,
          ERROR_MESSAGES.EMAIL_SEND_ERROR
        );
      }
    } catch (error) {
      return HttpResponse.internalServer(res, ERROR_MESSAGES.EMAIL_SEND_ERROR);
    }
  }
}
