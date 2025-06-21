import { Router } from "express";
import { routes } from "./routes";

const router = Router();

routes.forEach((route) => {
  try {
    // Crear instancias de las dependencias en orden
    const dependencies =
      route.dependencies?.map((DependencyClass) => {
        try {
          return new DependencyClass();
        } catch (error) {
          console.error(
            `Error creating dependency ${DependencyClass.name}:`,
            error
          );
          throw error;
        }
      }) || [];

    // Crear instancia del controller con sus dependencias
    const controllerInstance = new route.controller(...dependencies);

    // Crear instancia del router con el controller
    const routerInstance = new route.router(controllerInstance);

    // Registrar el router en la aplicación
    router.use(route.path, routerInstance.router);

    console.log(`✅ Route registered: ${route.path}`);
  } catch (error) {
    console.error(`❌ Error registering route ${route.path}:`, error);
    throw error;
  }
});

export default router;
