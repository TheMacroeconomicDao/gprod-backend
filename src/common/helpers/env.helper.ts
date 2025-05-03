/**
 * EnvHelper - вспомогательный класс для работы с переменными окружения
 * 
 * Особенности:
 * - Поддерживает три контура: development (dev), staging (stage), production (prod)
 * - Автоматически выбирает переменную на основе NODE_ENV
 * - Строгая типизация и валидация значений
 * - Логика fallback (резервные значения)
 * - Кэширование значений для производительности
 */
export class EnvHelper {
  // Определение контуров
  static readonly ENV_DEV = 'development';
  static readonly ENV_STAGE = 'staging';
  static readonly ENV_PROD = 'production';
  static readonly ENV_TEST = 'test';

  // Префиксы для переменных окружения (для обратной совместимости)
  private static readonly PREFIX_DEV = 'DEV';
  private static readonly PREFIX_STAGE = 'STAGE';
  private static readonly PREFIX_PROD = 'PRODUCTION';

  // Кэш для переменных окружения (оптимизация)
  private static cache: Record<string, string | number | boolean | string[]> = {};

  /**
   * Получает текущий контур выполнения
   */
  static get environment(): string {
    const env = process.env.NODE_ENV?.toLowerCase() || this.ENV_DEV;
    return env;
  }

  /**
   * Проверяет, запущено ли приложение в режиме разработки
   */
  static get isDevelopment(): boolean {
    return this.environment === this.ENV_DEV;
  }

  /**
   * Проверяет, запущено ли приложение в режиме staging
   */
  static get isStaging(): boolean {
    return this.environment === this.ENV_STAGE;
  }

  /**
   * Проверяет, запущено ли приложение в production режиме
   */
  static get isProduction(): boolean {
    return this.environment === this.ENV_PROD;
  }

  /**
   * Проверяет, запущено ли приложение в тестовом режиме
   */
  static get isTest(): boolean {
    return this.environment === this.ENV_TEST;
  }

  /**
   * Получает префикс для текущего контура
   */
  private static getPrefix(): string {
    if (this.isProduction) return this.PREFIX_PROD;
    if (this.isStaging) return this.PREFIX_STAGE;
    if (this.isDevelopment) return this.PREFIX_DEV;
    return this.PREFIX_DEV; // По умолчанию, если NODE_ENV некорректен
  }

  /**
   * Определяет правильную переменную окружения для текущего контура
   * Обновлено для работы с новой структурой .env файлов:
   * - Сначала проверяет простую переменную без префикса (новый подход)
   * - Затем проверяет префиксированную переменную (обратная совместимость)
   */
  private static resolveKey(key: string): string | undefined {
    // Приоритет:
    // 1. Простая переменная без префикса (работа с отдельными .env файлами)
    // 2. Префиксированная переменная для текущего контура (обратная совместимость)
    
    // Ищем простую переменную (новый подход с отдельными .env файлами)
    const commonValue = process.env[key];
    if (commonValue !== undefined) return commonValue;
    
    // Обратная совместимость с префиксами
    const prefix = this.getPrefix();
    const prefixedValue = process.env[`${prefix}_${key}`];
    if (prefixedValue !== undefined) return prefixedValue;
    
    // Ищем в других контурах (fallback для обратной совместимости)
    if (prefix !== this.PREFIX_DEV) {
      const devValue = process.env[`${this.PREFIX_DEV}_${key}`];
      if (devValue !== undefined) return devValue;
    }
    
    if (prefix !== this.PREFIX_STAGE) {
      const stageValue = process.env[`${this.PREFIX_STAGE}_${key}`];
      if (stageValue !== undefined) return stageValue;
    }
    
    if (prefix !== this.PREFIX_PROD) {
      const prodValue = process.env[`${this.PREFIX_PROD}_${key}`];
      if (prodValue !== undefined) return prodValue;
    }
    
    return undefined;
  }

  /**
   * Получает строковое значение переменной окружения
   * @param key Ключ переменной окружения
   * @param fallback Резервное значение, если переменная не найдена
   * @param required Требовать наличие переменной (выбросить ошибку, если отсутствует)
   * @returns Значение переменной окружения или fallback
   */
  static get(key: string, fallback?: string, required = false): string {
    // Проверяем кэш
    const cacheKey = `string:${key}`;
    if (cacheKey in this.cache) {
      return this.cache[cacheKey] as string;
    }
    
    const value = this.resolveKey(key);
    
    if (value !== undefined) {
      this.cache[cacheKey] = value;
      return value;
    }
    
    if (fallback !== undefined) {
      return fallback;
    }
    
    if (required) {
      const errorMsg = `Env variable ${key} not set. Проверьте .env файл для контура ${this.environment}!`;
      console.error(`EnvHelper: ${errorMsg}`);
      throw new Error(errorMsg);
    }
    
    return '';
  }

  /**
   * Получает числовое значение переменной окружения
   * @param key Ключ переменной окружения
   * @param fallback Резервное значение, если переменная не найдена или невалидна
   * @param required Требовать наличие переменной (выбросить ошибку, если отсутствует)
   * @returns Числовое значение переменной окружения или fallback
   */
  static int(key: string, fallback?: number, required = false): number {
    // Проверяем кэш
    const cacheKey = `int:${key}`;
    if (cacheKey in this.cache) {
      return this.cache[cacheKey] as number;
    }
    
    const stringValue = this.get(key, fallback?.toString(), required);
    
    if (stringValue === '') {
      return fallback !== undefined ? fallback : 0;
    }
    
    const num = Number(stringValue);
    
    if (isNaN(num)) {
      if (required) {
        throw new Error(`Env variable ${key} is not a valid number: ${stringValue}`);
      }
      return fallback !== undefined ? fallback : 0;
    }
    
    this.cache[cacheKey] = num;
    return num;
  }

  /**
   * Получает логическое значение переменной окружения
   * @param key Ключ переменной окружения
   * @param fallback Резервное значение, если переменная не найдена
   * @param required Требовать наличие переменной (выбросить ошибку, если отсутствует)
   * @returns Логическое значение переменной окружения или fallback
   */
  static bool(key: string, fallback = false, required = false): boolean {
    // Проверяем кэш
    const cacheKey = `bool:${key}`;
    if (cacheKey in this.cache) {
      return this.cache[cacheKey] as boolean;
    }
    
    const value = this.get(key, fallback ? 'true' : 'false', required);
    const boolValue = value === 'true' || value === '1' || value === 'yes';
    
    this.cache[cacheKey] = boolValue;
    return boolValue;
  }

  /**
   * Получает массив строк из переменной окружения (разделенной запятыми)
   * @param key Ключ переменной окружения
   * @param fallback Резервное значение, если переменная не найдена
   * @param required Требовать наличие переменной (выбросить ошибку, если отсутствует)
   * @returns Массив строк из переменной окружения или fallback
   */
  static array(key: string, fallback: string[] = [], required = false): string[] {
    // Проверяем кэш
    const cacheKey = `array:${key}`;
    if (cacheKey in this.cache) {
      return this.cache[cacheKey] as string[];
    }
    
    const value = this.get(key, fallback.join(','), required);
    
    if (!value && fallback.length > 0) {
      return fallback;
    }
    
    const result = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    
    this.cache[cacheKey] = result;
    return result;
  }

  /**
   * Получает URL базы данных для текущего контура
   * @returns URL базы данных
   */
  static getDatabaseUrl(): string {
    return this.get('DATABASE_URL', undefined, true);
  }

  /**
   * Получает секретный ключ для JWT
   * @returns JWT секрет
   */
  static getJwtSecret(): string {
    return this.get('JWT_SECRET', undefined, true);
  }

  /**
   * Получает время жизни JWT токена
   * @returns Время жизни токена в секундах или миллисекундах
   */
  static getJwtExpires(): string {
    return this.get('JWT_EXPIRES', '3600s', true);
  }

  /**
   * Получает порт для HTTP сервера
   * @returns Номер порта
   */
  static getPort(): number {
    return this.int('PORT', 3000, true);
  }

  /**
   * Очищает кэш переменных окружения
   * Полезно для тестов или при необходимости обновить значения
   */
  static clearCache(): void {
    this.cache = {};
  }
} 