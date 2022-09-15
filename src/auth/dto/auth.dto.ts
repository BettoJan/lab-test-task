import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ example: 'OlegPomidorov2022', description: 'Username' })
  @IsString()
  username: string;

  @ApiProperty({ example: '123456', description: 'Password' })
  @IsString()
  password: string;
}
