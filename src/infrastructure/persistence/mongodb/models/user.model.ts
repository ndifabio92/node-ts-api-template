import mongoose, { Schema, Document } from "mongoose";
import { User } from "../../../../domain/entities/user.entity";

export interface UserDocument extends Omit<User, "id">, Document {}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    roles: {
      type: [String],
      enum: ["admin", "user", "moderator"],
      default: ["user"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Solo índice para isActive ya que email y username ya tienen índices únicos
userSchema.index({ isActive: 1 });
userSchema.index({ roles: 1 });

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
