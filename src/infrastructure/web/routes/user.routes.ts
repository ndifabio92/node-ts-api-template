import { Router, Request, Response } from "express";

import { AuthMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";

export class UserRouter {
  public readonly router: Router;
  private readonly _controller: UserController;

  constructor(controller: UserController) {
    this.router = Router();
    this._controller = controller;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Todas las rutas de usuarios requieren autenticación
    this.router.use(AuthMiddleware.authenticate);

    // CRUD de usuarios
    this.router.get("/", (req: Request, res: Response) => {
      void this._controller.getAllUsers(req, res);
    });

    this.router.get("/:id", (req: Request, res: Response) => {
      void this._controller.getUserById(req, res);
    });

    this.router.put("/:id", (req: Request, res: Response) => {
      void this._controller.updateUser(req, res);
    });

    this.router.delete("/:id", (req: Request, res: Response) => {
      void this._controller.deleteUser(req, res);
    });

    // Gestión de roles
    this.router.post("/:id/roles", (req: Request, res: Response) => {
      void this._controller.addRole(req, res);
    });

    this.router.delete("/:id/roles", (req: Request, res: Response) => {
      void this._controller.removeRole(req, res);
    });
  }
}
