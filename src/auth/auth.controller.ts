import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './common/decorators/public.decorator';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @UsePipes(new ValidationPipe())
  create(@Body() createAuthDto: AuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Public()
  @Post('local/signin')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
}
