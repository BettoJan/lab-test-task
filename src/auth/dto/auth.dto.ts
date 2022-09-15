import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD_LESS_THAN_6_ERROR } from '../common/constants/auth.constants';

export class AuthDto {
  @ApiProperty({ example: 'OlegPomidorov2022', description: 'Username' })
  @IsString()
  username: string;

  @ApiProperty({ example: '123456', description: 'Password' })
  @MinLength(6, {
    message: PASSWORD_LESS_THAN_6_ERROR,
  })
  @IsString()
  password: string;
}
