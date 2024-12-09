import { Router } from "express";

export interface EnvConfigOptions {
    environment: string;
    port: number;
    origin: string[];
    db_port: number;
    db_host: string;
    db_name: string;
    db_username: string;
    db_password: string;
    database_url: string;
    jwt_secret: string;
    routes: Router;
}