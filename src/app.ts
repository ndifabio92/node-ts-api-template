import express, { Express } from "express";
import { corsMiddleware } from "./middlewares/cors.middlewares";
import { ErrorHandler } from "./middlewares/errorHandler.middlewares";
import { envs } from "./config/environment";
import apiRoutes from "./routes/index";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger";
// import "./modules/health/docs/health.swagger";
// import "./modules/email/docs/email.swagger";

export class App {
  private app: Express;
  private readonly port: number;

  constructor() {
    this.app = express();
    this.port = envs.port;
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    this.app.use(corsMiddleware);
    this.app.use(helmet());
  }

  private initializeSwagger() {
    // Swagger UI setup
    this.app.use(
      "/v1/api/swagger",
      swaggerUi.serve,
      swaggerUi.setup(specs, {
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Node.js TypeScript API Documentation",
        customfavIcon: "/favicon.ico",
        swaggerOptions: {
          docExpansion: "list",
          filter: true,
          showRequestHeaders: true,
        },
      })
    );

    // Serve Swagger JSON
    this.app.get("/swagger.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(specs);
    });
  }

  private initializeRoutes() {
    this.app.use("/v1/api", apiRoutes);
  }

  private initializeErrorHandling() {
    // Middleware para rutas no encontradas
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
      });
    });

    // Middleware de manejo de errores
    this.app.use(ErrorHandler.handle as any);
  }

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
        `📚 Documentación Swagger en http://localhost:${this.port}/v1/api/swagger`
      );
      console.log(
        `🌍 Environment: ${envs.development ? "development" : "prod"}`
      );
    });
  }
}
export default new App().getApp();
