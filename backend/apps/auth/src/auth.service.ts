import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  private readonly googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.usersRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name ?? null,
      picture: null,
    });

    const savedUser = await this.usersRepository.save(user);

    return this.buildAuthResponse(savedUser);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  async googleLogin(token: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new UnauthorizedException('Invalid Google token');
    }

    let user = await this.usersRepository.findOne({
      where: { email: payload.email },
    });

    const googleName = payload.name ?? null;
    const googlePicture = payload.picture ?? null;

    if (!user) {
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);

      user = this.usersRepository.create({
        email: payload.email,
        password: randomPassword,
        name: googleName,
        picture: googlePicture,
      });
    } else {
      user.name = googleName ?? user.name;
      user.picture = googlePicture ?? user.picture;
    }

    const savedUser = await this.usersRepository.save(user);

    return this.buildAuthResponse(savedUser);
  }

  async getUsersByIds(userIds: string[]) {
    if (!userIds || userIds.length === 0) {
      return {};
    }

    const users = await this.usersRepository.find({
      where: userIds.map(id => ({ id })),
    });

    const result: Record<string, { id: string; name: string | null; picture: string | null }> = {};
    users.forEach(user => {
      result[user.id] = {
        id: user.id,
        name: user.name,
        picture: user.picture,
      };
    });

    return result;
  }

  private buildAuthResponse(user: User) {
    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    };
  }
}