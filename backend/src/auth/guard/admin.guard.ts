import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const role = request.user && request.user.role;

    if (role !== 'admin') {
      throw new ForbiddenException('Access denied. User is not an administrator.');
    }

    return true;
  }
}