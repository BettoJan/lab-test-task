import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  SWAGGER_EMAIL_DESCRIPTION,
  SWAGGER_EMAIL_EXAMPLE,
  SWAGGER_PASSWORD_DESCRIPTION,
  SWAGGER_PASSWORD_EXAMPLE,
  SWAGGER_USERNAME_DESCRIPTION,
  SWAGGER_USERNAME_EXAMPLE,
} from '../common/constants/auth.constants';

export class UpdateUserDto {
  @ApiProperty({
    example: SWAGGER_USERNAME_EXAMPLE,
    description: SWAGGER_USERNAME_DESCRIPTION,
  })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({
    example: SWAGGER_PASSWORD_EXAMPLE,
    description: SWAGGER_PASSWORD_DESCRIPTION,
  })
  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  password: string;

  @ApiProperty({
    example: SWAGGER_EMAIL_EXAMPLE,
    description: SWAGGER_EMAIL_DESCRIPTION,
  })
  @IsEmail()
  @IsOptional()
  email: string;
}
