import { Request, Response } from "express";
import { HealthService } from "./health.service";
import { HttpResponse } from "../../core/utils/httpResponse";

export class HealthController {
  private readonly _healthService: HealthService;

  constructor(healthService: HealthService) {
    this._healthService = healthService;
  }

  async getStatus(_req: Request, res: Response) {
    try {
      const status = await this._healthService.checkApplicationHealth();
      return HttpResponse.success(res, status, "Health check completed");
    } catch (error) {
      console.error("Health check error:", error);
      return HttpResponse.internalServer(res, "Health check failed");
    }
  }
}
