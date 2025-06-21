import { IRoute } from "../core/interfaces/route.interface";
import { HealthController } from "../modules/health/health.controller";
import { HealthRouter } from "../modules/health/health.routes";
import { HealthService } from "../modules/health/health.service";
import { EmailService } from "../modules/email/email.service";
import { EmailRouter } from "../modules/email/email.routes";
import { EmailController } from "../modules/email/email.controller";
import { EmailRepository } from "../modules/email/email.repository";

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
    dependencies: [EmailRepository, EmailService],
  },
  // Ejemplo de otro módulo:
  // {
  //   path: "/users",
  //   router: UserRouter,
  //   controller: UserController,
  //   dependencies: [UserService, DatabaseService], // Múltiples dependencias
  // },
];
