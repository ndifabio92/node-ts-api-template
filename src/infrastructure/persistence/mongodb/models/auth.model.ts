import mongoose, { Schema, Document } from "mongoose";
import { AuthToken } from "../../../../domain/entities/auth.entity";

export interface AuthTokenDocument extends Omit<AuthToken, "id">, Document {}

const authTokenSchema = new Schema<AuthTokenDocument>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["refresh", "access"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices para mejorar el rendimiento (sin duplicar los que ya existen)
authTokenSchema.index({ userId: 1 });
authTokenSchema.index({ type: 1 });

// Índice TTL para eliminar tokens expirados automáticamente
authTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AuthTokenModel = mongoose.model<AuthTokenDocument>(
  "AuthToken",
  authTokenSchema
);
