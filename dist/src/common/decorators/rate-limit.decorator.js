"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimit = exports.RATE_LIMIT_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.RATE_LIMIT_KEY = 'rate_limit';
const RateLimit = (limit, ttlSeconds) => (0, common_1.SetMetadata)(exports.RATE_LIMIT_KEY, { limit, ttlSeconds });
exports.RateLimit = RateLimit;
//# sourceMappingURL=rate-limit.decorator.js.map