import swaggerJsdoc from "swagger-jsdoc";
import { envs } from "./environment";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node.js TypeScript API Template",
      version: "1.0.0",
      description: "A RESTful API built with Node.js, TypeScript, and Express",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC",
      },
    },
    servers: [
      {
        url: `http://localhost:${envs.port}/v1/api`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
            },
            message: {
              type: "string",
              example: "Success message",
            },
          },
        },
        HealthStatus: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "healthy",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
            },
            uptime: {
              type: "number",
              example: 123456,
            },
            version: {
              type: "string",
              example: "1.0.0",
            },
          },
        },
        EmailRequest: {
          type: "object",
          required: ["to", "subject", "html"],
          properties: {
            to: {
              oneOf: [
                {
                  type: "string",
                  format: "email",
                  example: "recipient@example.com",
                },
                {
                  type: "array",
                  items: {
                    type: "string",
                    format: "email",
                  },
                  example: ["recipient1@example.com", "recipient2@example.com"],
                },
              ],
              description: "Email recipient(s)",
            },
            subject: {
              type: "string",
              minLength: 1,
              maxLength: 200,
              example: "Test Email Subject",
              description: "Email subject line",
            },
            html: {
              type: "string",
              minLength: 1,
              example: "<h1>Hello World</h1><p>This is a test email.</p>",
              description: "HTML content of the email",
            },
            text: {
              type: "string",
              example: "Hello World\nThis is a test email.",
              description: "Plain text version of the email (optional)",
            },
            from: {
              type: "string",
              format: "email",
              example: "sender@example.com",
              description: "Sender email address (optional)",
            },
            attachments: {
              type: "array",
              items: {
                type: "object",
              },
              description: "Email attachments (optional)",
            },
          },
        },
        EmailResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
              properties: {
                sent: {
                  type: "boolean",
                  example: true,
                },
              },
            },
            message: {
              type: "string",
              example: "Email sent successfully",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["email", "username", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            username: {
              type: "string",
              minLength: 3,
              maxLength: 50,
              example: "johndoe",
            },
            password: {
              type: "string",
              minLength: 8,
              maxLength: 100,
              example: "password123",
            },
            firstName: {
              type: "string",
              maxLength: 100,
              example: "John",
            },
            lastName: {
              type: "string",
              maxLength: 100,
              example: "Doe",
            },
            roles: {
              type: "array",
              items: {
                type: "string",
                enum: ["admin", "user", "moderator"],
              },
              example: ["user"],
              default: ["user"],
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              example: "password123",
            },
          },
        },
        RefreshTokenRequest: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: {
              type: "string",
              example: "refresh_token_here",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Login successful",
            },
            data: {
              type: "object",
              properties: {
                user: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      example: "user_id_here",
                    },
                    email: {
                      type: "string",
                      example: "user@example.com",
                    },
                    username: {
                      type: "string",
                      example: "johndoe",
                    },
                    firstName: {
                      type: "string",
                      example: "John",
                    },
                    lastName: {
                      type: "string",
                      example: "Doe",
                    },
                    isActive: {
                      type: "boolean",
                      example: true,
                    },
                    createdAt: {
                      type: "string",
                      format: "date-time",
                      example: "2024-01-01T00:00:00.000Z",
                    },
                  },
                },
                tokens: {
                  type: "object",
                  properties: {
                    accessToken: {
                      type: "string",
                      example: "access_token_here",
                    },
                    refreshToken: {
                      type: "string",
                      example: "refresh_token_here",
                    },
                  },
                },
              },
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "user_id_here",
            },
            email: {
              type: "string",
              example: "user@example.com",
            },
            username: {
              type: "string",
              example: "johndoe",
            },
            firstName: {
              type: "string",
              example: "John",
            },
            lastName: {
              type: "string",
              example: "Doe",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            roles: {
              type: "array",
              items: {
                type: "string",
                enum: ["admin", "user", "moderator"],
              },
              example: ["user"],
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
            },
          },
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "newemail@example.com",
            },
            username: {
              type: "string",
              minLength: 3,
              maxLength: 50,
              example: "newusername",
            },
            firstName: {
              type: "string",
              maxLength: 100,
              example: "Jane",
            },
            lastName: {
              type: "string",
              maxLength: 100,
              example: "Smith",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            roles: {
              type: "array",
              items: {
                type: "string",
                enum: ["admin", "user", "moderator"],
              },
              example: ["user", "moderator"],
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Bad Request - Invalid input data",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        Unauthorized: {
          description: "Unauthorized - Authentication required",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        NotFound: {
          description: "Not Found - Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        Conflict: {
          description: "Conflict - Resource already exists",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        InternalServerError: {
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },
  apis: [
    "./src/infrastructure/web/docs/**/*.swagger.ts",
    "./src/infrastructure/web/routes/**/*.ts",
  ],
};

export const specs = swaggerJsdoc(options);
