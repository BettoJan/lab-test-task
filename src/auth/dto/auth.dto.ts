import { IsEmail, IsOptional, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEmail()
  email: string;
}
