import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as consts from '../common/constants/auth.constants';

export class UpdateUserDto {
  @ApiProperty({
    example: consts.SWAGGER_USERNAME_EXAMPLE,
    description: consts.SWAGGER_USERNAME_DESCRIPTION,
  })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({
    example: consts.SWAGGER_PASSWORD_EXAMPLE,
    description: consts.SWAGGER_PASSWORD_DESCRIPTION,
  })
  @IsString()
  @IsOptional()
  @MinLength(6, { message: consts.PASSWORD_MIN_LENGTH_ERROR })
  password: string;

  @ApiProperty({
    example: consts.SWAGGER_EMAIL_EXAMPLE,
    description: consts.SWAGGER_EMAIL_DESCRIPTION,
  })
  @IsEmail()
  @IsOptional()
  email: string;
}
