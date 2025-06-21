import { IRoute } from "../interfaces/IRoute";
import { HealthController } from "../controllers/health.controller";
import { HealthRouter } from "./health.routes";
import { HealthService } from "../services/health.service";
import { EmailService } from "../services/email/email.service";
import { EmailRouter } from "./email.routes";
import { EmailController } from "../controllers/email.controller";

export const routes: IRoute[] = [
  {
    path: "/health",
    router: HealthRouter,
    controller: HealthController,
    dependencies: [HealthService],
  },
  {
    path: "/email",
    router: EmailRouter,
    controller: EmailController,
    dependencies: [EmailService],
  },
  // Ejemplo de otro módulo:
  // {
  //   path: "/users",
  //   router: UserRouter,
  //   controller: UserController,
  //   dependencies: [UserService, DatabaseService], // Múltiples dependencias
  // },
];
