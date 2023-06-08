import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserDocument } from '../user/models/user.model';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: UserDocument }>();
    const user = request.user;

    if (user.role !== 'ADMIN')
      throw new ForbiddenException("Sorry you don't have access to the page");

    return user.role === 'ADMIN' && true;
  }
}
