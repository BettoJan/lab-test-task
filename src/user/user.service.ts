import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../core/database/database.service';
import { genSalt, hash } from 'bcryptjs';
import {
  EMAIL_OR_USERNAME_ERROR,
  USER_NOT_FOUND_ERROR,
} from './common/constants/auth.constants';
import { IUser } from './types/user.interface';
@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}
  async findAll() {
    return this.databaseService.executeQuery(`SELECT * FROM users`, []);
  }

  async findOne(id: number): Promise<IUser[]> {
    return this.databaseService.executeQuery(
      `SELECT * FROM users WHERE id = $1`,
      [id],
    );
  }

  async update(id: number, dto: UpdateUserDto): Promise<IUser> {
    const user = await this.databaseService.executeQuery(
      `SELECT * FROM users WHERE id = $1`,
      [id],
    );

    const isSomeUser = await this.databaseService.executeQuery(
      `
      SELECT * FROM users WHERE username = $1 or email = $2`,
      [dto.username, dto.email],
    );

    if (isSomeUser[0] && isSomeUser[0].id !== id)
      throw new UnauthorizedException(EMAIL_OR_USERNAME_ERROR);

    if (dto.password) {
      const salt = await genSalt(10);
      user[0].password = await hash(dto.password, salt);
    }

    const updatedUser = await this.databaseService.executeQuery(
      `
    UPDATE users SET username = $1, email = $2, passwordHash = $3 WHERE id = $4 RETURNING *`,
      [dto.username, dto.email, user[0].password, id],
    );

    return updatedUser[0];
  }

  async remove(id: number): Promise<IUser[]> {
    const user = await this.databaseService.executeQuery(
      `SELECT * FROM users WHERE id = $1`,
      [id],
    );
    if (!user[0]) throw new UnauthorizedException(USER_NOT_FOUND_ERROR);

    return this.databaseService.executeQuery(
      `DELETE FROM users WHERE id = $1`,
      [id],
    );
  }
}
