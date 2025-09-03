import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ResourceService } from '../resource.service';
import { Request } from 'express';

// Dùng metadata để truyền mức quyền cần thiết
export const RESOURCE_PERMISSION_KEY = 'resource_permission';

@Injectable()
export class ResourceGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private resourceService: ResourceService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      RESOURCE_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any; // từ JwtAuthGuard
    const resourceId =
      request.params.resourceId || request.body.resourceId || request.query.id;

    if (!resourceId) {
      throw new ForbiddenException('ResourceId is required');
    }

    const hasAccess = await this.resourceService.checkAccess(
      user.userId,
      resourceId,
      requiredPermission,
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        `You need ${requiredPermission} permission to access this resource`,
      );
    }

    return true;
  }
}
