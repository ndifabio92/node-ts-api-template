import { Router } from "express";
import { HealthController } from "../controllers/healthController";

export class HealthRouter {
  public router: Router;
  private readonly _controller: HealthController;

  constructor(controller: HealthController) {
    this.router = Router();
    this._controller = controller;
  }

  initializeRoutes() {
    this.router.get("/", this._controller.getStatus.bind(this._controller));
  }
}
