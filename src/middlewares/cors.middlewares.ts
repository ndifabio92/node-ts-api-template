import cors, { CorsOptions } from "cors";
import { envs } from "../config/environment";
import { HttpMethod } from "../core/utils/httpMethod";

export class CorsMiddleware {
  private static isOriginAllowed(
    origin: string | undefined,
    allowedOrigins: string[]
  ): boolean {
    if (!origin) {
      return false;
    }
    return allowedOrigins.includes(origin);
  }

  private static getCorsOptions(): CorsOptions {
    const isDevelopment = envs.development;
    const allowedOrigins = envs.corsOrigin ? envs.corsOrigin.split(",") : [];

    const corsOptions: CorsOptions = {
      methods: [
        HttpMethod.GET,
        HttpMethod.POST,
        HttpMethod.PUT,
        HttpMethod.DELETE,
        HttpMethod.OPTIONS,
      ],
      credentials: true,
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
      ],
    };

    if (isDevelopment) {
      corsOptions.origin = "*";
    } else {
      corsOptions.origin = (origin, callback) => {
        if (this.isOriginAllowed(origin, allowedOrigins)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: Origin "${origin}" is not allowed.`));
        }
      };
    }

    return corsOptions;
  }

  public static configure() {
    return cors(this.getCorsOptions());
  }
}

export const corsMiddleware = CorsMiddleware.configure();
