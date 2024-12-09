import { EnvConfiguration } from './config/envConfiguration';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

(async () => {
    main();
})();


function main() {

    const server = new Server({
        environment: EnvConfiguration.ENVIRONMENT,
        port: EnvConfiguration.PORT,
        database_url: EnvConfiguration.DATABASE_URL,
        db_host: EnvConfiguration.DB_HOST,
        db_name: EnvConfiguration.DB_NAME,
        db_password: EnvConfiguration.DB_PASSWORD,
        db_port: EnvConfiguration.DB_PORT,
        db_username: EnvConfiguration.DB_USERNAME,
        jwt_secret: EnvConfiguration.JWT_SECRET,
        origin: EnvConfiguration.ORIGIN || [],
        routes: AppRoutes.routes,
    });

    server.start();
}