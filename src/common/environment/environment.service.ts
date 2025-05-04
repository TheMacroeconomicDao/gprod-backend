import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

/**
 * Сервис для работы с переменными окружения
 * Более объектно-ориентированная альтернатива EnvHelper
 */
@Injectable()
export class EnvironmentService {
  // Определение контуров
  readonly ENV_DEV = 'development';
  readonly ENV_STAGE = 'staging';
  readonly ENV_PROD = 'production';
  readonly ENV_TEST = 'test';

  // Кэш для переменных окружения (оптимизация)
  private cache: Record<string, string | number | boolean | string[]> = {};

  constructor() {
    // При создании сервиса можно выполнить начальную загрузку переменных
    this.ensureEnvLoaded();
  }

  /**
   * Обеспечивает загрузку .env файла
   */
  private ensureEnvLoaded(): void {
    // Проверяем, загружены ли уже переменные окружения
    if (process.env.ENV_LOADED === 'true') {
      return;
    }

    // Получаем текущее окружение
    const nodeEnv = process.env.NODE_ENV || this.ENV_DEV;
    
    // Формируем имена потенциальных .env файлов
    const envFile = `.env.${nodeEnv}`;
    const defaultEnvFile = '.env';
    
    // Список файлов для проверки в порядке приоритета
    const envFiles = [
      envFile,           // .env.development, .env.production, ...
      defaultEnvFile,    // .env (обычно симлинк на активный контур)
    ];
    
    // Перебираем файлы и загружаем первый найденный
    for (const file of envFiles) {
      if (fs.existsSync(file)) {
        console.log(`[EnvironmentService] Загружаем переменные окружения из ${file}`);
        
        // Загружаем переменные из файла
        const result = dotenv.config({ path: file });
        
        if (result.error) {
          console.error(`[EnvironmentService] Ошибка при загрузке ${file}:`, result.error);
          continue;
        }
        
        // Устанавливаем флаг, что переменные уже загружены
        process.env.ENV_LOADED = 'true';
        return;
      }
    }
    
    console.warn(`[EnvironmentService] Ни один из .env файлов не найден (искали: ${envFiles.join(', ')})`);
  }

  /**
   * Получает текущий контур выполнения
   */
  get environment(): string {
    return process.env.NODE_ENV?.toLowerCase() || this.ENV_DEV;
  }

  /**
   * Проверяет, запущено ли приложение в режиме разработки
   */
  get isDevelopment(): boolean {
    return this.environment === this.ENV_DEV;
  }

  /**
   * Проверяет, запущено ли приложение в режиме staging
   */
  get isStaging(): boolean {
    return this.environment === this.ENV_STAGE;
  }

  /**
   * Проверяет, запущено ли приложение в production режиме
   */
  get isProduction(): boolean {
    return this.environment === this.ENV_PROD;
  }

  /**
   * Проверяет, запущено ли приложение в тестовом режиме
   */
  get isTest(): boolean {
    return this.environment === this.ENV_TEST;
  }

  /**
   * Проверяет, запущено ли приложение в Docker контейнере
   */
  get isDocker(): boolean {
    try {
      if (fs.existsSync('/.dockerenv')) {
        return true;
      }
    } catch (e) {
      // Игнорируем ошибки
    }
    
    return process.env.RUNNING_IN_DOCKER === 'true';
  }

  /**
   * Получает строковое значение переменной окружения
   */
  getString(key: string, defaultValue?: string): string {
    const cacheKey = `string:${key}`;
    if (cacheKey in this.cache) {
      return this.cache[cacheKey] as string;
    }
    
    const value = process.env[key];
    
    if (value !== undefined) {
      this.cache[cacheKey] = value;
      return value;
    }
    
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    
    return '';
  }
  
  /**
   * Получает обязательное строковое значение, выбрасывает ошибку если отсутствует
   */
  getStringOrThrow(key: string): string {
    const value = this.getString(key);
    
    if (!value) {
      throw new Error(`Обязательная переменная окружения ${key} не задана`);
    }
    
    return value;
  }

  /**
   * Получает числовое значение переменной окружения
   */
  getNumber(key: string, defaultValue?: number): number {
    const cacheKey = `number:${key}`;
    if (cacheKey in this.cache) {
      return this.cache[cacheKey] as number;
    }
    
    const stringValue = this.getString(key, defaultValue?.toString());
    
    if (!stringValue) {
      return defaultValue ?? 0;
    }
    
    const num = Number(stringValue);
    
    if (isNaN(num)) {
      return defaultValue ?? 0;
    }
    
    this.cache[cacheKey] = num;
    return num;
  }

  /**
   * Получает булево значение переменной окружения
   */
  getBoolean(key: string, defaultValue = false): boolean {
    const cacheKey = `boolean:${key}`;
    if (cacheKey in this.cache) {
      return this.cache[cacheKey] as boolean;
    }
    
    const value = this.getString(key, defaultValue ? 'true' : 'false');
    const boolValue = value === 'true' || value === '1' || value === 'yes';
    
    this.cache[cacheKey] = boolValue;
    return boolValue;
  }

  /**
   * Получает массив строк из переменной окружения (разделен запятыми)
   */
  getArray(key: string, defaultValue: string[] = []): string[] {
    const cacheKey = `array:${key}`;
    if (cacheKey in this.cache) {
      return this.cache[cacheKey] as string[];
    }
    
    const value = this.getString(key, defaultValue.join(','));
    
    if (!value && defaultValue.length > 0) {
      return defaultValue;
    }
    
    const result = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    
    this.cache[cacheKey] = result;
    return result;
  }

  /**
   * Получает порт для HTTP сервера
   */
  getPort(): number {
    // Получаем порт из переменных окружения с более строгой проверкой
    const portFromEnv = process.env.PORT;
    
    if (portFromEnv) {
      const parsedPort = parseInt(portFromEnv, 10);
      if (!isNaN(parsedPort) && parsedPort > 0 && parsedPort < 65536) {
        return parsedPort; 
      }
      console.warn(`[EnvironmentService] Некорректное значение PORT: "${portFromEnv}"`);
    }
    
    // Пробуем получить порт через getNumber
    const envPort = this.getNumber('PORT');
    
    if (envPort > 0 && envPort < 65536) {
      return envPort;
    }
    
    // Используем порты по умолчанию в зависимости от окружения
    if (this.isDevelopment) {
      return 3008;
    } else if (this.isStaging) {
      return 3003;
    } else if (this.isProduction) {
      return 3007;
    } else if (this.isTest) {
      return 3009;
    }
    
    return 3000;
  }

  /**
   * Очищает кэш переменных окружения
   */
  clearCache(): void {
    this.cache = {};
  }
} 