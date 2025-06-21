# Validación de Email con Zod

## Resumen

Se ha implementado la validación de datos de email usando **Zod** en lugar de la validación manual con condicionales `if`. Esto proporciona una validación más robusta, tipado automático y mensajes de error más descriptivos.

## Cambios Realizados

### 1. Esquema de Validación (`src/models/dtos/email.schema.ts`)

```typescript
import { z } from "zod";

export const sendEmailSchema = z.object({
  to: z.union([
    z.string().email("Invalid email format"),
    z
      .array(z.string().email("Invalid email format"))
      .min(1, "At least one email is required"),
  ]),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject too long"),
  html: z.string().min(1, "HTML content is required"),
  text: z.string().optional(),
  from: z.string().email("Invalid from email format").optional(),
  attachments: z.array(z.any()).optional(),
});

export type SendEmailRequest = z.infer<typeof sendEmailSchema>;
```

### 2. Controlador Actualizado (`src/controllers/email.controller.ts`)

**Antes (validación manual):**

```typescript
const { to, subject, html } = req.body;

if (!to || !subject || !html) {
  return HttpResponse.badRequest(
    res,
    "Missing required fields: to, subject, and html are required"
  );
}
```

**Después (validación con Zod):**

```typescript
const validationResult = sendEmailSchema.safeParse(req.body);

if (!validationResult.success) {
  const errors = validationResult.error.flatten().fieldErrors;
  const errorMessage = Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages?.join(", ")}`)
    .join("; ");

  return HttpResponse.badRequest(res, errorMessage);
}
```

## Ventajas de usar Zod

### 1. **Validación Robusta**

- Validación de formato de email
- Validación de longitud de campos
- Soporte para arrays de emails
- Validación de campos opcionales

### 2. **Tipado Automático**

- TypeScript infiere automáticamente los tipos
- No hay necesidad de mantener interfaces separadas
- Detección de errores en tiempo de compilación

### 3. **Mensajes de Error Descriptivos**

- Errores específicos por campo
- Mensajes personalizables
- Formato consistente de errores

### 4. **Flexibilidad**

- Fácil extensión para nuevos campos
- Transformación de datos
- Validación condicional

## Ejemplos de Uso

### Datos Válidos

```typescript
const validData = {
  to: "usuario@ejemplo.com",
  subject: "Asunto del email",
  html: "<h1>Contenido HTML</h1>",
  text: "Contenido en texto plano",
  from: "remitente@ejemplo.com",
};
```

### Múltiples Destinatarios

```typescript
const multipleRecipients = {
  to: ["usuario1@ejemplo.com", "usuario2@ejemplo.com"],
  subject: "Email grupal",
  html: "<p>Contenido para todos</p>",
};
```

### Errores de Validación

```typescript
// Error: "subject: Required; html: Required"
const invalidData = {
  to: "usuario@ejemplo.com",
  // Falta subject y html
};

// Error: "to: Invalid email format"
const invalidEmail = {
  to: "email-invalido",
  subject: "Asunto",
  html: "<p>Contenido</p>",
};
```

## Tests Actualizados

Los tests han sido actualizados para reflejar los nuevos mensajes de error de Zod:

- **Test Unitario**: `tests/unit/email/email.controller.test.ts`
- **Test de Integración**: `tests/integration/email.integration.test.ts`

## Archivo de Ejemplo

Se ha creado un archivo de ejemplo en `src/examples/email-validation-example.ts` que muestra diferentes casos de uso de la validación con Zod.

## Dependencias

- **Zod**: `^3.25.67` (ya estaba instalado en el proyecto)

## Próximos Pasos

1. **Middleware de Validación**: Crear un middleware genérico para validar requests con Zod
2. **Validación de Otros Endpoints**: Aplicar el mismo patrón a otros controladores
3. **Esquemas Compartidos**: Crear esquemas reutilizables para validaciones comunes
4. **Documentación de API**: Generar documentación automática basada en los esquemas de Zod
