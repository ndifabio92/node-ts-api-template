import { Router } from "express";
import { HealthController } from "./healthController";

export class HealthRoutes {
    static get routes(): Router {
        const router = Router();
        const healthController = new HealthController();

        router.get('/health/db', healthController.checkDatabase);

        return router;
    }
}