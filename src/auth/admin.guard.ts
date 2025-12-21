import { Injectable, CanActivate, type ExecutionContext, UnauthorizedException } from '@nestjs/common';


@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const adminEmail = request.headers['x-admin-email']

    if(adminEmail === process.env.ADMIN_EMAIL) return true
    throw new UnauthorizedException('只有管理员可以操作');
  }
}