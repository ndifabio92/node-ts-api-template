import express from "express";
import { corsMiddleware } from "./middlewares/cors";
import { envs } from "./config/environment";
import apiRoutes from "./routes/index";

const app = express();
const PORT = envs.port;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Rutas
app.use("/v1/api", apiRoutes);

// Middleware de manejo de errores
// app.use(ErrorHandler.handle);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/v1/api`);
  console.log(`🏥 Health check en http://localhost:${PORT}/v1/api/health`);
});

export default app;
