import { CanActivate, ExecutionContext, Injectable, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RATE_LIMIT_KEY } from '../../decorators/rate-limit.decorator';

interface RateLimitState {
  count: number;
  expiresAt: number;
}

const store = new Map<string, RateLimitState>();

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rateLimit = this.reflector.getAllAndOverride<{ limit: number; ttlSeconds: number }>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!rateLimit) return true;
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id;
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const key = userId ? `user:${userId}:${context.getHandler().name}` : `ip:${ip}:${context.getHandler().name}`;
    const now = Date.now();
    let state = store.get(key);
    if (!state || state.expiresAt < now) {
      state = { count: 0, expiresAt: now + rateLimit.ttlSeconds * 1000 };
    }
    state.count++;
    if (state.count > rateLimit.limit) {
      throw new HttpException(`Rate limit exceeded (${rateLimit.limit} per ${rateLimit.ttlSeconds}s)`, 429);
    }
    store.set(key, state);
    return true;
  }
} 