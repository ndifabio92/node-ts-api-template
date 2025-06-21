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
  apis: ["./src/swagger/*.ts", "./src/routes/*.ts", "./src/controllers/*.ts"], // Updated to include swagger folder
};

export const specs = swaggerJsdoc(options);
