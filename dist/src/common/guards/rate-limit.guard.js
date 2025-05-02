"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rate_limit_decorator_1 = require("../decorators/rate-limit.decorator");
const store = new Map();
let RateLimitGuard = class RateLimitGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const rateLimit = this.reflector.getAllAndOverride(rate_limit_decorator_1.RATE_LIMIT_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!rateLimit)
            return true;
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
            throw new common_1.HttpException(`Rate limit exceeded (${rateLimit.limit} per ${rateLimit.ttlSeconds}s)`, 429);
        }
        store.set(key, state);
        return true;
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RateLimitGuard);
//# sourceMappingURL=rate-limit.guard.js.map