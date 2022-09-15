import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';
import { AuthDto } from './dto/auth.dto';
import { genSalt, hash, compare } from 'bcryptjs';
import {
  ALREADY_REGISTERED_ERROR,
  PASSWORD_NOT_MATCH_ERROR,
  USER_NOT_FOUND_ERROR,
} from './common/constants/auth.constants';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, Token } from './common/types';
import { IUser } from 'src/user/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: AuthDto): Promise<Token> {
    const oldUser = await this.databaseService.executeQuery(
      `
      SELECT * FROM users WHERE username = $1`,
      [dto.username],
    );

    if (oldUser[0]) throw new UnauthorizedException(ALREADY_REGISTERED_ERROR);

    const salt = await genSalt(10);
    const passwordHash = await hash(dto.password, salt);

    const newUser = await this.databaseService.executeQuery(
      `INSERT INTO users (username, passwordHash) VALUES ($1, $2) RETURNING *`,
      [dto.username, passwordHash],
    );
    const token = await this.generationToken(newUser[0].username);

    return token;
  }

  async validateUser(login: string, password: string): Promise<IUser> {
    const user = await this.databaseService.executeQuery(
      `SELECT * FROM users WHERE username = $1`,
      [login],
    );

    if (!user[0]) throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    const isPasswordMatching = await compare(password, user[0].passwordhash);

    if (!isPasswordMatching)
      throw new UnauthorizedException(PASSWORD_NOT_MATCH_ERROR);

    return user[0];
  }

  async generationToken(username: string): Promise<Token> {
    const jwtPayload: JwtPayload = { username };
    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '15d',
    });
    return { accessToken };
  }

  async login(dto: AuthDto): Promise<Token> {
    const user = await this.validateUser(dto.username, dto.password);

    const token = await this.generationToken(user.username);

    return token;
  }
}
