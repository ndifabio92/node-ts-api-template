import { Router } from "express";
import { routes } from "./routes";

const router = Router();

routes.forEach((route) => {
  // Crear instancias de las dependencias
  const dependencies =
    route.dependencies?.map((DependencyClass) => new DependencyClass()) || [];

  // Crear instancia del controller con sus dependencias
  const controllerInstance = new route.controller(...dependencies);

  // Crear instancia del router con el controller
  const routerInstance = new route.router(controllerInstance);

  // Registrar el router en la aplicación
  router.use(route.path, routerInstance.router);
});

export default router;
