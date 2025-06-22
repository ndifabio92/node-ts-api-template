import { IAuthRepository } from "../../../../domain/interfaces/IAuthRepository";
import {
  AuthToken,
  CreateAuthTokenDto,
} from "../../../../domain/entities/auth.entity";
import { AuthTokenModel, AuthTokenDocument } from "../models/auth.model";

export class AuthMongoDbRepository implements IAuthRepository {
  async createToken(token: CreateAuthTokenDto): Promise<AuthToken> {
    const newToken = new AuthTokenModel(token);
    const savedToken = await newToken.save();
    return this.mapToDomain(savedToken);
  }

  async findTokenByValue(token: string): Promise<AuthToken | null> {
    const authToken = await AuthTokenModel.findOne({ token });
    return authToken ? this.mapToDomain(authToken) : null;
  }

  async findTokensByUserId(userId: string): Promise<AuthToken[]> {
    const tokens = await AuthTokenModel.find({ userId });
    return tokens.map((token) => this.mapToDomain(token));
  }

  async deleteToken(id: string): Promise<boolean> {
    const result = await AuthTokenModel.findByIdAndDelete(id);
    return !!result;
  }

  async deleteTokensByUserId(userId: string): Promise<boolean> {
    const result = await AuthTokenModel.deleteMany({ userId });
    return result.deletedCount > 0;
  }

  async deleteExpiredTokens(): Promise<boolean> {
    const result = await AuthTokenModel.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    return result.deletedCount > 0;
  }

  private mapToDomain(tokenDoc: AuthTokenDocument): AuthToken {
    return {
      id: (tokenDoc._id as any).toString(),
      userId: tokenDoc.userId,
      token: tokenDoc.token,
      type: tokenDoc.type,
      expiresAt: tokenDoc.expiresAt,
      createdAt: tokenDoc.createdAt,
    };
  }
}
