import { RoleService } from './role.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { HasPermission } from 'src/permission/has-permission.decorator';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @HasPermission('roles')
  @Get()
  async all() {
    return this.roleService.all();
  }

  @HasPermission('roles')
  @Post()
  async create(@Body('name') name: string, @Body('permissions') ids: number[]) {
    return this.roleService.create({
      name,
      permissions: ids.map((id) => ({ id })),
    });
  }

  @HasPermission('roles')
  @Get(':id')
  async get(@Param('id') id: number) {
    return await this.roleService.findOne({ id }, ['permissions']);
  }

  @HasPermission('roles')
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('permissions') ids: number[],
  ) {
    await this.roleService.update(id, { name });
    const role = await this.roleService.findOne({ id });

    return this.roleService.create({
      ...role,
      permissions: ids.map((id) => ({ id })),
    });
  }

  @HasPermission('roles')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.roleService.delete(id);
  }
}
