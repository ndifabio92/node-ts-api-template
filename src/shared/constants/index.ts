export const APP_CONSTANTS = {
  API_VERSION: "v1",
  API_PREFIX: "/v1/api",
  DEFAULT_PORT: 4000,
  DEFAULT_TIMEOUT: 30000,
  MAX_FILE_SIZE: "10mb",
  MAX_REQUEST_SIZE: "10mb",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Access forbidden",
  BAD_REQUEST: "Bad request",
  VALIDATION_ERROR: "Validation error",
  EMAIL_SEND_ERROR: "Error sending email",
  DATABASE_ERROR: "Database error",
} as const;

export const SUCCESS_MESSAGES = {
  EMAIL_SENT: "Email sent successfully",
  HEALTH_CHECK: "Service is healthy",
  RESOURCE_CREATED: "Resource created successfully",
  RESOURCE_UPDATED: "Resource updated successfully",
  RESOURCE_DELETED: "Resource deleted successfully",
} as const;
