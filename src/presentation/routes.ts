import { Router } from "express";
import { HealthRoutes } from "./health/healthRoutes";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        const defaultPath = '/api/v1';

        router.use(defaultPath, HealthRoutes.routes);

        return router;
    }
}