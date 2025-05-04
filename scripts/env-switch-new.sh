#!/bin/bash

# Улучшенный скрипт для переключения между контурами окружения с использованием отдельных .env файлов
# Поддерживаемые контуры: dev, stage, prod

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
print_message() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка наличия аргумента
if [ $# -ne 1 ]; then
    print_error "Использование: $0 <dev|stage|prod>"
    exit 1
fi

ENV=$1

# Проверка корректности аргумента
if [ "$ENV" != "dev" ] && [ "$ENV" != "stage" ] && [ "$ENV" != "prod" ]; then
    print_error "Ошибка: допустимые значения - dev, stage или prod"
    exit 1
fi

# Папка проекта
PROJECT_DIR=$(pwd)

# Соответствие между сокращениями и полными именами
ENV_FULL=""
ENV_FILE=""
COMPOSE_FILE=""

case $ENV in
    "dev")
        ENV_FULL="development"
        ENV_FILE=".env.development"
        COMPOSE_FILE="docker-compose.dev.yml"
        ;;
    "stage")
        ENV_FULL="staging"
        ENV_FILE=".env.staging"
        COMPOSE_FILE="docker-compose.stage.yml"
        ;;
    "prod")
        ENV_FULL="production"
        ENV_FILE=".env.production"
        COMPOSE_FILE="docker-compose.prod.yml"
        ;;
esac

# Проверяем наличие .env файлов
if [ ! -f "$ENV_FILE" ]; then
    # Проверяем наличие шаблонов
    if [ -f ".env-templates/$ENV_FILE" ]; then
        print_warning "Файл $ENV_FILE не найден. Создаем из шаблона."
        cp ".env-templates/$ENV_FILE" "$ENV_FILE"
        print_success "Файл $ENV_FILE создан из шаблона."
    else
        print_warning "Файл $ENV_FILE и его шаблон не найдены."
        print_message "Создаем базовый файл $ENV_FILE."
        
        # Создаем простой .env файл
        echo "NODE_ENV=$ENV_FULL" > "$ENV_FILE"
        echo "DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_${ENV}" >> "$ENV_FILE"
        
        print_warning "Создан базовый файл $ENV_FILE. Рекомендуется дополнить его необходимыми переменными."
    fi
fi

# Копируем выбранный .env файл в основной .env
print_message "Копирование $ENV_FILE в .env..."
cp "$ENV_FILE" .env
print_success "Файл .env обновлен для окружения $ENV_FULL."

# Остановка всех контейнеров
print_message "📦 Останавливаем контейнеры всех окружений..."
docker compose -f docker-compose.dev.yml down 2>/dev/null
docker compose -f docker-compose.stage.yml down 2>/dev/null
docker compose -f docker-compose.prod.yml down 2>/dev/null

# Запуск выбранного окружения
print_message "🚀 Запускаем $ENV_FULL окружение..."
docker compose -f "$COMPOSE_FILE" up -d

# Проверка статуса запуска
if [ $? -eq 0 ]; then
    print_success "✅ Окружение $ENV_FULL успешно запущено"
    
    # Выводим информацию о доступных сервисах
    case $ENV in
        "dev")
            print_message "🔗 API доступен по адресу: http://localhost:3000"
            print_message "🔗 Adminer доступен по адресу: http://localhost:8080"
            ;;
        "stage")
            print_message "🔗 API доступен по адресу: http://localhost:3003"
            print_message "🔗 Prometheus доступен по адресу: http://localhost:9090"
            print_message "🔗 Grafana доступна по адресу: http://localhost:3100"
            ;;
        "prod")
            print_message "🔗 API доступен по адресу: https://localhost (через Nginx, порт 443)"
            print_message "🔗 Grafana доступна по адресу: http://localhost:3500"
            ;;
    esac
else
    print_error "❌ Не удалось запустить окружение $ENV_FULL"
    exit 1
fi

print_message ""
print_message "📋 Статус запущенных контейнеров:"
docker ps

print_message ""
print_message "💡 Используйте следующие команды для управления окружением:"
print_message "    - pnpm run docker:$ENV - запуск окружения"
print_message "    - pnpm run docker:$ENV:stop - остановка окружения"
print_message "    - pnpm run docker:$ENV:build - пересборка и запуск окружения" 

print_message ""
print_success "Окружение успешно переключено на $ENV_FULL" 