import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';

@Controller('auth')
export class AuthController {
  private authServiceUrl = 'http://localhost:3001';

  constructor(private readonly httpService: HttpService) {}

  private async proxyRequest<T>(path: string, body: any) {
    try {
      const response = await lastValueFrom(this.httpService.post(`${this.authServiceUrl}${path}`, body, { timeout: 30000 }));
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new HttpException(error.response.data || 'Upstream error', error.response.status);
      }
      throw new HttpException('Upstream service error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.proxyRequest('/auth/register', registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.proxyRequest('/auth/login', loginDto);
  }

  @Post('google')
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    return this.proxyRequest('/auth/google', { idToken: googleLoginDto.idToken });
  }
}
