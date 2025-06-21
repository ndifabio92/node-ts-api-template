# Swagger Documentation

This API includes comprehensive Swagger/OpenAPI documentation that provides an interactive interface for exploring and testing all available endpoints.

## Accessing the Documentation

### Swagger UI

- **URL**: `http://localhost:3000/v1/api/swagger`
- **Description**: Interactive web interface for exploring the API

### Swagger JSON

- **URL**: `http://localhost:3000/swagger.json`
- **Description**: Raw OpenAPI specification in JSON format

## Available Endpoints

### Health Check

- **GET** `/v1/api/health`
- **Description**: Check the health status of the application
- **Response**: Returns application status, uptime, version, and timestamp

### Email Service

- **POST** `/v1/api/email`
- **Description**: Send emails with HTML content
- **Features**:
  - Support for single or multiple recipients
  - HTML and plain text content
  - Optional sender email
  - Optional attachments

## Using Swagger UI

1. **Navigate to the Documentation**: Visit `http://localhost:3000/v1/api/swagger`
2. **Explore Endpoints**: Click on any endpoint to expand its details
3. **Test Endpoints**: Use the "Try it out" button to test endpoints directly
4. **View Schemas**: Check the "Schemas" section to understand request/response structures
5. **Download Spec**: Use the Swagger JSON endpoint to download the specification

## Features

- **Interactive Testing**: Test endpoints directly from the browser
- **Request/Response Examples**: Pre-filled examples for common use cases
- **Schema Validation**: Automatic validation of request bodies
- **Response Documentation**: Detailed response schemas and examples
- **Error Handling**: Documented error responses and status codes

## API Information

- **Title**: Node.js TypeScript API Template
- **Version**: 1.0.0
- **Description**: A RESTful API built with Node.js, TypeScript, and Express
- **License**: ISC

## Project Structure

The Swagger documentation is organized in a modular way:

```
src/
├── swagger/                    # 📁 Swagger documentation folder
│   ├── index.ts               # Entry point for all documentation
│   ├── health.swagger.ts      # Health endpoint documentation
│   ├── email.swagger.ts       # Email endpoint documentation
│   └── README.md              # Documentation guidelines
├── config/
│   └── swagger.ts             # Swagger configuration and schemas
└── controllers/               # Clean controllers without Swagger comments
    ├── health.controller.ts
    └── email.controller.ts
```

## Development

The Swagger documentation is organized in separate files for better maintainability. To add documentation for new endpoints:

### 1. Create Documentation File

Create a new file in `src/swagger/` following the naming convention: `{controller-name}.swagger.ts`

### 2. Add JSDoc Comments

Add JSDoc comments with `@swagger` annotations following the established pattern.

### 3. Update Index File

Import the new documentation file in `src/swagger/index.ts`

### 4. Define Schemas (if needed)

Add new schemas in `src/config/swagger.ts` in the `components.schemas` section.

### 5. Restart Server

Restart the server to see the changes.

## Example JSDoc Comment

```typescript
/**
 * @swagger
 * /your-endpoint:
 *   get:
 *     summary: Brief description
 *     description: Detailed description
 *     tags: [TagName]
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourSchema'
 */
```

## Benefits of This Organization

- ✅ **Clean Code**: Controllers are free of documentation comments
- ✅ **Modular**: Each endpoint has its own documentation file
- ✅ **Maintainable**: Easy to update documentation without touching business logic
- ✅ **Scalable**: Simple to add new endpoints and their documentation
- ✅ **Reusable**: Schemas can be shared between different endpoints
