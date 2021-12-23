import { AuthGuard } from './../auth/auth.guard';
import { HasPermission } from './has-permission.decorator';
import { PermissionService } from './permission.service';
import { Controller, Get, UseGuards } from '@nestjs/common';

@UseGuards(AuthGuard)
@Controller('permissions')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get()
  @HasPermission('view_permissions')
  async all() {
    return this.permissionService.all();
  }
}
