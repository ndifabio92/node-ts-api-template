import { AuthToken, CreateAuthTokenDto } from "../entities/auth.entity";

export interface IAuthRepository {
  createToken(token: CreateAuthTokenDto): Promise<AuthToken>;
  findTokenByValue(token: string): Promise<AuthToken | null>;
  findTokensByUserId(userId: string): Promise<AuthToken[]>;
  deleteToken(id: string): Promise<boolean>;
  deleteTokensByUserId(userId: string): Promise<boolean>;
  deleteExpiredTokens(): Promise<boolean>;
}
