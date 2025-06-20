import { IRoute } from "../interfaces/route.interface";
import { HealthController } from "../controllers/healthController";
import { HealthRouter } from "./healthRoutes";
import { HealthService } from "../services/healthService";

export const routes: IRoute[] = [
  {
    path: "/health",
    router: HealthRouter,
    controller: HealthController,
    dependencies: [HealthService], // Lista de dependencias que necesita el controller
  },
  // Ejemplo de otro módulo:
  // {
  //   path: "/users",
  //   router: UserRouter,
  //   controller: UserController,
  //   dependencies: [UserService, DatabaseService], // Múltiples dependencias
  // },
];
