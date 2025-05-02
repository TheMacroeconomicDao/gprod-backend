"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvHelper = void 0;
class EnvHelper {
    static get(key, fallback) {
        const env = process.env.NODE_ENV?.toUpperCase() || 'DEVELOPMENT';
        const devKey = env === 'DEVELOPMENT' ? process.env[`DEV_${key}`] : undefined;
        const value = process.env[`${env}_${key}`] ?? devKey ?? process.env[key];
        if (value !== undefined)
            return value;
        if (fallback !== undefined)
            return fallback;
        console.error(`EnvHelper: Env variable ${env}_${key} not set. Проверь .env и docker-compose!`);
        throw new Error(`Env variable ${env}_${key} not set`);
    }
    static int(key, fallback) {
        const val = this.get(key, fallback?.toString());
        const num = Number(val);
        if (isNaN(num))
            throw new Error(`Env variable ${key} is not a number`);
        return num;
    }
    static bool(key, fallback) {
        const val = this.get(key, fallback ? 'true' : 'false');
        return val === 'true' || val === '1';
    }
}
exports.EnvHelper = EnvHelper;
//# sourceMappingURL=env.helper.js.map