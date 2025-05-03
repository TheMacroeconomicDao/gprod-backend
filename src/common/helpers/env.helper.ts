export class EnvHelper {
  static get(key: string, fallback?: string): string {
    const env = process.env.NODE_ENV?.toUpperCase() || 'DEVELOPMENT';
    let prefix = env;
    if (env === 'PRODUCTION') prefix = 'PRODUCTION';
    if (env === 'DEVELOPMENT') prefix = 'DEV';
    if (env === 'STAGING') prefix = 'STAGE';
    const prodKey = env === 'PRODUCTION' ? process.env[`PRODUCTION_${key}`] : undefined;
    const devKey = env === 'DEVELOPMENT' ? process.env[`DEV_${key}`] : undefined;
    const stageKey = env === 'STAGING' ? process.env[`STAGE_${key}`] : undefined;
    const value = process.env[`${prefix}_${key}`] ?? prodKey ?? stageKey ?? devKey ?? process.env[key];
    if (value !== undefined) return value;
    if (fallback !== undefined) return fallback;
    console.error(`EnvHelper: Env variable ${prefix}_${key} not set. Проверь .env и docker-compose!`);
    throw new Error(`Env variable ${prefix}_${key} not set`);
  }

  static int(key: string, fallback?: number): number {
    const val = this.get(key, fallback?.toString());
    const num = Number(val);
    if (isNaN(num)) throw new Error(`Env variable ${key} is not a number`);
    return num;
  }

  static bool(key: string, fallback?: boolean): boolean {
    const val = this.get(key, fallback ? 'true' : 'false');
    return val === 'true' || val === '1';
  }

  static array(key: string, fallback?: string[]): string[] {
    const val = process.env[key] || (fallback ? fallback.join(',') : undefined);
    if (!val) return fallback || [];
    return val.split(',').map((s) => s.trim()).filter(Boolean);
  }
} 