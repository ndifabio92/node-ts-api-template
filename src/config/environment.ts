import "dotenv/config";
import { get } from "env-var";

export const envs = {
  port: get("PORT").required().asPortNumber() || 4000,
  development: get("DEVELOPMENT").asBool() || true,
  corsOrigin: get("CORS_ORIGIN").required().asString(),
};
