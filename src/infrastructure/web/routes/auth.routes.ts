import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class AuthRouter {
  public readonly router: Router;
  private readonly _controller: AuthController;

  constructor(controller: AuthController) {
    this.router = Router();
    this._controller = controller;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Rutas públicas
    this.router.post("/register", (req: Request, res: Response) => {
      void this._controller.register(req, res);
    });

    this.router.post("/login", (req: Request, res: Response) => {
      void this._controller.login(req, res);
    });

    this.router.post("/refresh-token", (req: Request, res: Response) => {
      void this._controller.refreshToken(req, res);
    });

    // Rutas privadas
    this.router.post(
      "/logout",
      AuthMiddleware.authenticate,
      (req: Request, res: Response) => {
        void this._controller.logout(req, res);
      }
    );

    this.router.get(
      "/me",
      AuthMiddleware.authenticate,
      (req: Request, res: Response) => {
        void this._controller.me(req, res);
      }
    );
  }
}
