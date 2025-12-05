import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthSettings } from '../../settings/auth.settings';
import { User } from '../../entities/user.entity';
import { RefreshToken } from '../../entities/refresh-token.entity';
import { RegisterDto } from '../../dtos/register.dto';
import { LoginDto } from '../../dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
   
    private readonly config: ConfigService,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshRepo: Repository<RefreshToken>,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.users.findOne({
      where: { username: dto.username },
    });
    if (existing) throw new ConflictException('Username already exists');

    const hash = await bcrypt.hash(dto.password, AuthSettings.bcryptRounds);
    const user = await this.users.save({
      username: dto.username,
      passwordHash: hash,
      role: dto.role || 'developer',
    });

    const tokens = await this.issueTokens(user);
    await this.saveRefreshToken(user, tokens.refreshToken);
    return tokens;
  }

  async login(dto: LoginDto) {
    const user = await this.users.findOne({
      where: { username: dto.username },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.issueTokens(user);
    await this.saveRefreshToken(user, tokens.refreshToken);
    return tokens;
  }

  async refresh(refreshToken: string) {
    const stored = await this.refreshRepo.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });
    if (!stored) throw new UnauthorizedException('Invalid refresh token');

    try {
      await this.jwt.verifyAsync(refreshToken, {
        secret:
          process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me',
      });
    } catch {
      throw new UnauthorizedException('Expired refresh token');
    }

    const tokens = await this.issueTokens(stored.user);
    await this.saveRefreshToken(stored.user, tokens.refreshToken);
    return tokens;
  }

 async validateAccessToken(token: string) {
    const adminToken = this.config.get<string>('ADMIN_TOKEN');

    // 🔑 1. Master admin token shortcut
    if (adminToken && token === adminToken) {
      return {
        sub: 'admin-fixed-id',
        username: 'admin',
        role: 'admin',
        isAdminToken: true,
      };
    }

    // 🔐 2. Normal JWT verification
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      });

      return payload; // must contain { sub, username, role, ... }
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async issueTokens(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = await this.jwt.signAsync(
      payload as any,
      ({
        secret:
          process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me',
        expiresIn: AuthSettings.accessTokenTTL,
      } as any),
    );

    const refreshToken = await this.jwt.signAsync(
      payload as any,
      ({
        secret:
          process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me',
        expiresIn: AuthSettings.refreshTokenTTL,
      } as any),
    );

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(user: User, token: string) {
    const entity = this.refreshRepo.create({ user, token });
    await this.refreshRepo.save(entity);
  }
}
