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

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: AuthDto) {
    const oldUser = await this.databaseService.executeQuery(
      `
      SELECT * FROM users WHERE username = $1`,
      [dto.username],
    );
    if (oldUser[0]) {
      throw new UnauthorizedException(ALREADY_REGISTERED_ERROR);
    }
    const salt = await genSalt(10);
    const passwordHash = await hash(dto.password, salt);
    const newUser = await this.databaseService.executeQuery(
      `INSERT INTO users (username, passwordHash, email) VALUES ($1, $2, $3) RETURNING *`,
      [dto.username, passwordHash, dto.email],
    );
    return newUser;
  }

  async validateUser(login: string, password: string) {
    const user = await this.databaseService.executeQuery(
      `SELECT * FROM users WHERE username = $1`,
      [login],
    );
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    console.log(user[0].passwordhash);
    console.log(password);

    const isPasswordMatching = await compare(password, user[0].passwordhash);
    if (!isPasswordMatching) {
      throw new UnauthorizedException(PASSWORD_NOT_MATCH_ERROR);
    }
    return { login: user[0].username };
  }

  async login(username: string) {
    const payload = { username };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
  // const user = await this.databaseService.executeQuery(
  //   `SELECT * FROM users WHERE username = $1`,
  //   [login],
  // );
  // console.log(String(user.passwordHash));
  // if (!user) {
  //   throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
  // }
  //
  // const isPasswordMatching = await compare(password, user.passwordHash);
  //const isPasswordMatching = await compare(password, user[0].passwordhash);
  //-----------------
  // async findAll() {
  //   const users = await this.databaseService.executeQuery(
  //     `SELECT * FROM users`,
  //   );
  //   return users;
  // }
  //
  // findOne(id: number) {
  //   const user = this.databaseService.executeQuery(
  //     `SELECT * FROM users WHERE id = $1`,
  //     [id],
  //   );
  //   return user;
  // }
  //
  // update(id: number, updateAuthDto: AuthDto) {
  //   const user = this.databaseService.executeQuery(
  //     `UPDATE users SET username = $1, passwordhash = $2, email = $3 WHERE id = $4 RETURNING *`,
  //     [updateAuthDto.username, updateAuthDto.password, updateAuthDto.email, id],
  //   );
  //   return user;
  // }
  //
  // remove(id: number) {
  //   const user = this.databaseService.executeQuery(
  //     `DELETE FROM users WHERE id = $1`,
  //     [id],
  //   );
  //   return user;
  // }
}
