import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TypeRole } from '../auth.interface';
import { OnlyAdminGuard } from '../guards/admin.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';

export const Auth = (role: TypeRole = 'user') =>
  applyDecorators(
    role === 'admin'
      ? UseGuards(JwtAuthGuard, OnlyAdminGuard)
      : UseGuards(JwtAuthGuard),
  );

UseGuards(AuthGuard('jwt'));
