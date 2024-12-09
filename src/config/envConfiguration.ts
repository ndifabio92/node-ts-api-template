import 'dotenv/config';
import { get } from 'env-var';

export const EnvConfiguration = {
    ENVIRONMENT: get('ENVIRONMENT').default('development').required().asString(),
    PORT: get('PORT').default(8000).required().asPortNumber(),
    ORIGIN: get('ORIGIN').asArray(),
    DB_PORT: get('DB_PORT').default(5432).required().asPortNumber(),
    DB_HOST: get('DB_HOST').default('localhost').required().asString(),
    DB_NAME: get('DB_NAME').default('TemplateDB').required().asString(),
    DB_USERNAME: get('DB_USERNAME').default('postgres').required().asString(),
    DB_PASSWORD: get('DB_PASSWORD').default('MySecretPassWord').required().asString(),
    DATABASE_URL: get('DATABASE_URL').default('postgresql://postgres:123456@localhost:5432/TemplateDB').asString(),
    JWT_SECRET: get('JWT_SECRET').default('development').required().asString(),
}