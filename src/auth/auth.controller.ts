import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { loginDto } from './models/login.dto';
import { registerDto } from './models/register.dto';
import { UserService } from './../user/user.service';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() body: registerDto) {
    if (body.password !== body.password_confirmation) {
      throw new BadRequestException("Password confirmation didn't match.");
    }

    const hashed = await bcrypt.hash(body.password, 12);
    return this.userService.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: hashed,
      role: { id: 2 },
    });
  }

  @Post('login')
  async login(
    @Body() body: loginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findOne({ email: body.email });

    if (!user) throw new NotFoundException('user not found');

    if (!(await bcrypt.compare(body.password, user.password)))
      throw new BadRequestException('Invalid email or password');

    const jwt = await this.jwtService.signAsync({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true });

    return user;
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async user(@Req() request: Request) {
    const id = await this.authService.userId(request);
    const user = await this.userService.findOne({ id });

    return user;
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { message: 'User logged out successfully.' };
  }
}
