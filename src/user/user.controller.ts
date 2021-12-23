import { HasPermission } from './../permission/has-permission.decorator';
import { AuthService } from './../auth/auth.service';
import { UserUpdateDto } from './models/user-update.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserCreateDto } from './models/user-create.dto';
import { UserService } from './user.service';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './models/user.entity';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @HasPermission('users')
  @Get()
  async all(@Query('page') page = 1) {
    return this.userService.paginate(page, ['role']);
  }

  @HasPermission('users')
  @Post()
  async create(@Body() body: UserCreateDto): Promise<User> {
    const password = await bcrypt.hash('1234', 12);
    const { role_id, ...data } = body;

    return await this.userService.create({
      ...data,
      password,
      role: { id: role_id },
    });
  }

  @HasPermission('users')
  @Get(':id')
  async get(@Param('id') id: number) {
    return await this.userService.findOne({ id }, ['role']);
  }

  @Put('info')
  async updateInfo(@Req() request: Request, @Body() body: UserUpdateDto) {
    const id = await this.authService.userId(request);
    await this.userService.update(id, body);
    return this.userService.findOne({ id });
  }

  @Put('password')
  async updatePassword(
    @Req() request: Request,
    @Body('password') password: string,
    @Body('password_confirmation') password_confirmation: string,
  ) {
    if (password !== password_confirmation) {
      throw new BadRequestException("Password confirmation didn't match.");
    }

    const id = await this.authService.userId(request);
    const hashed = await bcrypt.hash(password, 12);

    await this.userService.update(id, {
      password: hashed,
    });
    return this.userService.findOne({ id });
  }

  @HasPermission('users')
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: UserUpdateDto) {
    const { role_id, ...data } = body;
    await this.userService.update(id, {
      ...data,
      role: { id: role_id },
    });
    return this.userService.findOne({ id });
  }

  @HasPermission('users')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
