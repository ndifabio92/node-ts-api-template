import { Router, Request, Response } from "express";
import { EmailController } from "../controllers/email.controller";

export class EmailRouter {
  public readonly router: Router;
  private readonly _controller: EmailController;

  constructor(controller: EmailController) {
    this.router = Router();
    this._controller = controller;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/send", (req: Request, res: Response) => {
      void this._controller.sendEmail(req, res);
    });
  }
}
