import { IRoute } from "../../../domain/interfaces/IRoute";
import { HealthController } from "../controllers/health.controller";
import { HealthRouter } from "./health.routes";
import { HealthService } from "../../../application/health.service";
import { EmailService } from "../../../application/email.service";
import { EmailRouter } from "./email.routes";
import { EmailController } from "../controllers/email.controller";
import { EmailRepository } from "../../persistence/email.repository";
import { AuthController } from "../controllers/auth.controller";
import { AuthRouter } from "./auth.routes";
import { AuthService } from "../../../application/auth.service";
import { UserRouter } from "./user.routes";
import { UserService } from "../../../application/user.service";
import { UserController } from "../controllers/user.controller";

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
  {
    path: "/auth",
    router: AuthRouter,
    controller: AuthController,
    dependencies: [AuthService],
  },
  {
    path: "/users",
    router: UserRouter,
    controller: UserController,
    dependencies: [UserService],
  },
  // Ejemplo de otro módulo:
  // {
  //   path: "/users",
  //   router: UserRouter,
  //   controller: UserController,
  //   dependencies: [UserService, DatabaseService], // Múltiples dependencias
  // },
];
