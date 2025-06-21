import { Router } from "express";
import { routes } from "./routes-definitions";

const router = Router();

routes.forEach((route) => {
  try {
    let instance: any;

    if (route.dependencies && route.dependencies.length > 0) {
      // Tomamos la primera dependencia y la instanciamos sin argumentos iniciales,
      // asumiendo que la primera dependencia no tiene dependencias ella misma.
      let lastInstance: any = undefined;

      // Iteramos sobre las dependencias para crear la cadena de inyección.
      for (const DependencyClass of route.dependencies) {
        lastInstance = new DependencyClass(lastInstance);
      }
      instance = lastInstance;
    }

    // Crear instancia del controller con la dependencia final (si existe)
    const controllerInstance = new route.controller(instance);

    const routerInstance = new route.router(controllerInstance);

    router.use(route.path, routerInstance.router);

    console.log(`✅ Route registered: ${route.path}`);
  } catch (error) {
    console.error(`❌ Error registering route ${route.path}:`, error);
    throw error;
  }
});

export default router;
