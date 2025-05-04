import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../decorators/roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { EnvHelper } from '../../helpers/env.helper';

@Injectable()
export class RolesGuard implements CanActivate {
  private jwtService: JwtService;

  constructor(private reflector: Reflector) {
    this.jwtService = new JwtService({
      secret: EnvHelper.get('JWT_SECRET'),
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('[RolesGuard] Required roles:', requiredRoles);
    console.log('[RolesGuard] Request path:', context.switchToHttp().getRequest().path);
    console.log('[RolesGuard] Request method:', context.switchToHttp().getRequest().method);
    
    if (!requiredRoles) {
      console.log('[RolesGuard] No roles required, allowing access');
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    let user = request.user;
    
    // Если user.roles не определен, пробуем извлечь роли из токена напрямую
    if (!user?.roles) {
      try {
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          const decodedToken = await this.jwtService.verifyAsync(token);
          console.log('[RolesGuard] Decoded token:', decodedToken);
          
          if (decodedToken.roles) {
            user = { ...user, roles: decodedToken.roles };
            request.user = user; // Обновляем объект пользователя в запросе
          }
        }
      } catch (error) {
        console.error('[RolesGuard] Error decoding token:', error);
      }
    }
    
    console.log('[RolesGuard] User roles:', user?.roles);
    const hasRole = requiredRoles.some((role) => (user?.roles || []).includes(role));
    console.log('[RolesGuard] Has required role:', hasRole);
    
    return hasRole;
  }
} 