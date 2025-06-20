import { Request, Response } from "express";
import { HealthService } from "../services/healthService";

export class HealthController {
  private readonly _service: HealthService;
  constructor(service: HealthService) {
    this._service = service;
  }

  async getStatus(_req: Request, res: Response) {
    const status = await this._service.checkApplicationHealth();
    res.json(status);
  }
}
