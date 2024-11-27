import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable()
export class OnlyAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<{ user: User }>();

    const user = request.user;

    if (!user.isAdmin)
      throw new ForbiddenException('Только для администратора');

    return user.isAdmin;
  }
}
