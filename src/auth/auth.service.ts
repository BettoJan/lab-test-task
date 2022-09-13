import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(private databaseService: DatabaseService) {}

  async create(dto: CreateAuthDto) {
    const newUser = await this.databaseService.executeQuery(
      `INSERT INTO users (username, passwordHash, email) VALUES ($1, $2, $3) RETURNING *`,
      [dto.username, dto.passwordHash, dto.email],
    );
    return dto;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
