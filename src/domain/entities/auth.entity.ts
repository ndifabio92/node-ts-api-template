export interface AuthToken {
  id?: string;
  userId: string;
  token: string;
  type: "refresh" | "access";
  expiresAt: Date;
  createdAt: Date;
}

export interface CreateAuthTokenDto {
  userId: string;
  token: string;
  type: "refresh" | "access";
  expiresAt: Date;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
