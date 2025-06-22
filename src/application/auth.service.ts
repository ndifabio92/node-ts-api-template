import { IAuthRepository } from "../domain/interfaces/IAuthRepository";
import {
  AuthToken,
  CreateAuthTokenDto,
  LoginDto,
  RegisterDto,
} from "../domain/entities/auth.entity";
import { CreateUserDto } from "../domain/entities/user.entity";
import { RepositoryFactory } from "../infrastructure/persistence/repository.factory";
import { UserService } from "./user.service";
import { envs } from "../infrastructure/config/environment";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class AuthService {
  private authRepository: IAuthRepository;
  private userService: UserService;

  constructor() {
    this.authRepository = RepositoryFactory.getAuthRepository();
    this.userService = new UserService();
  }

  async register(userData: RegisterDto): Promise<{
    user: any;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    // Crear el usuario
    const createUserDto: CreateUserDto = {
      email: userData.email,
      username: userData.username,
      password: await this.hashPassword(userData.password),
      ...(userData.firstName && { firstName: userData.firstName }),
      ...(userData.lastName && { lastName: userData.lastName }),
    };

    const user = await this.userService.createUser(createUserDto);

    // Generar tokens
    const tokens = await this.generateTokens(user.id!);

    return {
      user: { ...user, password: undefined }, // No devolver la contraseña
      tokens,
    };
  }

  async login(loginData: LoginDto): Promise<{
    user: any;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    // Buscar usuario por email
    const user = await this.userService.getUserByEmail(loginData.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Verificar contraseña
    const isValidPassword = await this.verifyPassword(
      loginData.password,
      user.password
    );
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    // Verificar que el usuario esté activo
    if (!user.isActive) {
      throw new Error("User account is deactivated");
    }

    // Generar tokens
    const tokens = await this.generateTokens(user.id!);

    return {
      user: { ...user, password: undefined }, // No devolver la contraseña
      tokens,
    };
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verificar el JWT refresh token
      const decoded = jwt.verify(refreshToken, envs.jwtRefreshSecret) as any;

      // Verificar que el token existe en la base de datos
      const token = await this.authRepository.findTokenByValue(refreshToken);
      if (!token || token.type !== "refresh" || token.expiresAt < new Date()) {
        throw new Error("Invalid or expired refresh token");
      }

      // Eliminar el token anterior
      await this.authRepository.deleteToken(token.id!);

      // Generar nuevos tokens
      return await this.generateTokens(decoded.userId);
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }

  async logout(userId: string): Promise<boolean> {
    // Eliminar todos los tokens del usuario
    return await this.authRepository.deleteTokensByUserId(userId);
  }

  async validateToken(token: string): Promise<AuthToken | null> {
    try {
      // Verificar el JWT access token
      const decoded = jwt.verify(token, envs.jwtSecret) as any;

      // Verificar que el token existe en la base de datos
      const authToken = await this.authRepository.findTokenByValue(token);
      if (!authToken || authToken.expiresAt < new Date()) {
        return null;
      }
      return authToken;
    } catch (error) {
      return null;
    }
  }

  private async generateTokens(
    userId: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Generar JWT access token
    const accessToken = jwt.sign({ userId, type: "access" }, envs.jwtSecret, {
      expiresIn: "15m",
    });

    // Generar JWT refresh token
    const refreshToken = jwt.sign(
      { userId, type: "refresh" },
      envs.jwtRefreshSecret,
      { expiresIn: "7d" }
    );

    // Calcular fechas de expiración
    const accessTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ); // 7 días

    const accessTokenData: CreateAuthTokenDto = {
      userId,
      token: accessToken,
      type: "access",
      expiresAt: accessTokenExpiresAt,
    };

    const refreshTokenData: CreateAuthTokenDto = {
      userId,
      token: refreshToken,
      type: "refresh",
      expiresAt: refreshTokenExpiresAt,
    };

    await this.authRepository.createToken(accessTokenData);
    await this.authRepository.createToken(refreshTokenData);

    return { accessToken, refreshToken };
  }

  private async hashPassword(password: string): Promise<string> {
    // En un entorno real, usarías bcrypt o argon2
    return await bcrypt.hash(password, 10);
  }

  private async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const hashedInput = await this.hashPassword(password);
    return hashedInput === hashedPassword;
  }
}
