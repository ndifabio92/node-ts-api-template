import { IAuthRepository } from "../../../../domain/interfaces/IAuthRepository";
import {
  AuthToken,
  CreateAuthTokenDto,
} from "../../../../domain/entities/auth.entity";
import { PrismaConnection } from "../../../config/database/prisma.config";

export class AuthPostgreSqlRepository implements IAuthRepository {
  private prisma = PrismaConnection.getClient();

  async createToken(token: CreateAuthTokenDto): Promise<AuthToken> {
    const newToken = await this.prisma.authToken.create({
      data: {
        userId: token.userId,
        token: token.token,
        type: token.type,
        expiresAt: token.expiresAt,
      },
    });

    return this.mapToDomain(newToken);
  }

  async findTokenByValue(token: string): Promise<AuthToken | null> {
    const authToken = await this.prisma.authToken.findUnique({
      where: { token },
    });
    return authToken ? this.mapToDomain(authToken) : null;
  }

  async findTokensByUserId(userId: string): Promise<AuthToken[]> {
    const tokens = await this.prisma.authToken.findMany({
      where: { userId },
    });
    return tokens.map((token: string) => this.mapToDomain(token));
  }

  async deleteToken(id: string): Promise<boolean> {
    try {
      await this.prisma.authToken.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteTokensByUserId(userId: string): Promise<boolean> {
    try {
      await this.prisma.authToken.deleteMany({
        where: { userId },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteExpiredTokens(): Promise<boolean> {
    try {
      await this.prisma.authToken.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private mapToDomain(tokenEntity: any): AuthToken {
    return {
      id: tokenEntity.id,
      userId: tokenEntity.userId,
      token: tokenEntity.token,
      type: tokenEntity.type,
      expiresAt: tokenEntity.expiresAt,
      createdAt: tokenEntity.createdAt,
    };
  }
}
