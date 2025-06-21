import { envs } from "../../config/environment";

export interface HealthStatus {
  status: "OK" | "ERROR";
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
}

export class HealthService {
  constructor() {}

  async checkApplicationHealth(): Promise<HealthStatus> {
    try {
      const healthStatus: HealthStatus = {
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: envs.development ? "Development" : "Prod",
        version: "1.0.0",
      };

      return healthStatus;
    } catch (error) {
      console.error("Health check failed:", error);

      return {
        status: "ERROR",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: envs.development ? "Development" : "Prod",
        version: "1.0.0",
      };
    }
  }
}
