import express, { Express } from "express";
import { corsMiddleware } from "./middlewares/cors";
import { envs } from "./config/environment";
import apiRoutes from "./routes/index";
import helmet from "helmet";

export class App {
  private app: Express;
  private readonly port: number;

  constructor() {
    this.app = express();
    this.port = envs.port;
    this.initializeMiddlewares();
    this.initializeRoutes();
    // this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    this.app.use(corsMiddleware);
    this.app.use(helmet());
  }

  private initializeRoutes() {
    // Ruta para verificar que la API está funcionando
    this.app.get("/", (req, res) => {
      res.json({
        message: "API is running",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
      });
    });

    this.app.use("/v1/api", apiRoutes);
  }

  // private initializeErrorHandling() {
  //   // Middleware para rutas no encontradas
  //   this.app.use((req, res) => {
  //     res.status(404).json({
  //       success: false,
  //       message: `Route ${req.originalUrl} not found`,
  //     });
  //   });

  //   // Middleware de manejo de errores
  //   this.app.use(ErrorHandler.handle as any);
  // }

  public getApp(): Express {
    return this.app;
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Servidor corriendo en puerto ${this.port}`);
      console.log(`📡 API disponible en http://localhost:${this.port}/v1/api`);
      console.log(
        `🏥 Health check en http://localhost:${this.port}/v1/api/health`
      );
      console.log(
        `🌍 Environment: ${envs.development ? "development" : "prod"}`
      );
    });
  }
}
export default new App().getApp();
