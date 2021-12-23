import { Role } from './../role/models/role.entity';
import { User } from './../user/models/user.entity';
import { RoleService } from './../role/role.service';
import { UserService } from './../user/user.service';
import { AuthService } from './../auth/auth.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const access = this.reflector.get<string>('access', context.getHandler());
    if (!access) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const id = await this.authService.userId(request);
    const user: User = await this.userService.findOne({ id }, ['role']);

    const role: Role = await this.roleService.findOne({ id: user.role.id }, [
      'permissions',
    ]);

    if (request.method === 'GET') {
      return role.permissions.some(
        (p) => p.name === `view_${access}` || p.name === `edit_${access}`,
      );
    }

    return role.permissions.some((p) => p.name === `edit_${access}`);
  }
}
