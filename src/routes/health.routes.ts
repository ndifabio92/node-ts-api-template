import { Router, Request, Response } from "express";
import { HealthController } from "../controllers/health.controller";

export class HealthRouter {
  public readonly router: Router;
  private readonly _controller: HealthController;

  constructor(controller: HealthController) {
    this.router = Router();
    this._controller = controller;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", (req: Request, res: Response) => {
      void this._controller.getStatus(req, res);
    });
  }
}
