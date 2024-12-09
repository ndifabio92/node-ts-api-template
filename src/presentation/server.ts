import express, { Router } from 'express';
import { EnvConfigOptions } from '../interfaces/envConfigOptions';

export class Server {
    private app = express();
    private readonly environment: string;
    private readonly port: number;
    private readonly orgin: string[];
    private readonly db_port: number;
    private readonly db_host: string;
    private readonly db_name: string;
    private readonly db_username: string;
    private readonly db_password: string;
    private readonly database_url: string;
    private readonly jwt_secret: string;
    private readonly routes: Router;

    constructor(options: EnvConfigOptions) {
        const { environment, port, origin, db_host, db_port, db_name, db_username, db_password, database_url, jwt_secret, routes } = options;
        this.environment = environment;
        this.port = port;
        this.orgin = origin || [];
        this.db_port = Number(db_port);
        this.db_host = db_host;
        this.db_name = db_name;
        this.db_username = db_username;
        this.db_password = db_password;
        this.database_url = database_url;
        this.jwt_secret = jwt_secret;
        this.routes = routes;
    }

    async start() {
        //* Middlewares
        this.app.use(express.json())

        // Routes
        this.app.use(this.routes);

        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}