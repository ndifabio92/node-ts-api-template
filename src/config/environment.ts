import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(65535))
    .default("4000"),
  DEVELOPMENT: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  CORS_ORIGIN: z.string().min(1),
  MAILER_SERVICE: z.string().min(1),
  MAILER_EMAIL: z.string().email(),
  MAILER_SECRET_KEY: z.string().min(1),
});

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  console.error(
    "❌ Invalid environment variables:",
    envParse.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
}

export const envs = {
  port: envParse.data.PORT,
  development: envParse.data.DEVELOPMENT,
  corsOrigin: envParse.data.CORS_ORIGIN,
  mailerService: envParse.data.MAILER_SERVICE,
  mailerEmail: envParse.data.MAILER_EMAIL,
  mailerSecretKey: envParse.data.MAILER_SECRET_KEY,
};
