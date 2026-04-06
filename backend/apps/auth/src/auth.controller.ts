import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('google')
  googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    const token = googleLoginDto.idToken ?? googleLoginDto.token;
    if (!token) {
      throw new BadRequestException('Google token is required');
    }

    return this.authService.googleLogin(token);
  }

  @Post('users')
  getUsersByIds(@Body() body: { userIds: string[] }) {
    return this.authService.getUsersByIds(body.userIds);
  }
}