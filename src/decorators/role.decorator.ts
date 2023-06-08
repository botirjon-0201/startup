import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleUser } from '../user/models/user.model';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';
import { InstructorGuard } from '../guards/instructor.guard';

export const Roles = (role: RoleUser = 'USER') => {
  return applyDecorators(
    (role === 'ADMIN' && UseGuards(JwtAuthGuard, AdminGuard)) ||
      (role === 'USER' && UseGuards(JwtAuthGuard)) ||
      (role === 'INSTRUCTOR' && UseGuards(JwtAuthGuard, InstructorGuard)),
  );
};
