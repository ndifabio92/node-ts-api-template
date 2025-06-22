import { z } from "zod";

const userRoleSchema = z.enum(["admin", "user", "moderator"]);

export const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username too long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password too long"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name too long")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name too long")
    .optional(),
  roles: z.array(userRoleSchema).default(["user"]),
});

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username too long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    )
    .optional(),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name too long")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name too long")
    .optional(),
  isActive: z.boolean().optional(),
  roles: z.array(userRoleSchema).optional(),
});

export const addRoleSchema = z.object({
  role: userRoleSchema,
});

export const removeRoleSchema = z.object({
  role: userRoleSchema,
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type AddRoleRequest = z.infer<typeof addRoleSchema>;
export type RemoveRoleRequest = z.infer<typeof removeRoleSchema>;
