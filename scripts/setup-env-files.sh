#!/bin/bash

# ===================================================
# 🌟 GPROD Advanced Environment Setup Script
# ===================================================
# Автоматическое создание и настройка .env файлов для всех окружений
# Версия 2.0

# Цвета для красивого вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Символы для вывода
CHECK_MARK="${GREEN}✓${NC}"
CROSS_MARK="${RED}✗${NC}"
ARROW="${BLUE}→${NC}"
STAR="${YELLOW}★${NC}"
INFO="${CYAN}ℹ${NC}"

# Функции для вывода
print_header() {
    echo -e "\n${WHITE}${BOLD}$1${NC}\n"
}

print_subheader() {
    echo -e "\n${CYAN}$1${NC}"
}

print_success() {
    echo -e "${CHECK_MARK} ${GREEN}$1${NC}"
}

print_error() {
    echo -e "${CROSS_MARK} ${RED}$1${NC}"
}

print_warning() {
    echo -e "${STAR} ${YELLOW}$1${NC}"
}

print_info() {
    echo -e "${INFO} ${BLUE}$1${NC}"
}

print_step() {
    echo -e "${ARROW} ${PURPLE}$1${NC}"
}

# Определение системы
detect_system() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        OS_TYPE="MacOS"
        SED_INPLACE=("sed" "-i" "")
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS_TYPE="Linux"
        SED_INPLACE=("sed" "-i")
    else
        OS_TYPE="Unknown"
        SED_INPLACE=("sed" "-i")
    fi
    print_info "Определена операционная система: ${BOLD}$OS_TYPE${NC}"
}

# Проверка наличия Docker
check_docker() {
    if command -v docker &> /dev/null; then
        DOCKER_AVAILABLE=true
        print_success "Docker доступен в системе"
    else
        DOCKER_AVAILABLE=false
        print_warning "Docker не найден в системе, будет настроено для локальной разработки"
    fi
}

# Создание директории и файлов
print_header "🚀 Настройка окружения проекта GPROD"
print_step "Определение системных параметров..."
detect_system
check_docker

print_step "Создание директории для шаблонов .env файлов..."
mkdir -p .env-templates

print_subheader "📝 Генерация шаблонов .env файлов"

# Создаем шаблон для development
print_step "Создание шаблона для development..."
cat > .env-templates/.env.development << 'EOL'
# Основные настройки окружения
NODE_ENV=development
PORT=3008

# База данных
DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_dev

# JWT и авторизация
JWT_SECRET=dev_jwt_secret_change_me_in_production
JWT_EXPIRES=3600s
JWT_REFRESH_EXPIRES=7d

# Логирование
LOG_LEVEL=debug
DEBUG=false

# CORS и безопасность
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Дополнительные настройки
APP_NAME=GPROD API (Dev)
APP_VERSION=1.0.0
HOST=localhost
DOMAIN=localhost

# Postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gprod_dev

# Инструментальные переменные
LOGGER_TEST_MODE=false
RUNNING_IN_DOCKER=false
EOL
print_success "Шаблон .env.development создан"

# Создаем шаблон для staging
print_step "Создание шаблона для staging..."
cat > .env-templates/.env.staging << 'EOL'
# Основные настройки окружения
NODE_ENV=staging
PORT=3003

# База данных
DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_stage

# JWT и авторизация
JWT_SECRET=stage_jwt_secret_change_me_in_production
JWT_EXPIRES=3600s
JWT_REFRESH_EXPIRES=7d

# Логирование
LOG_LEVEL=info
DEBUG=false

# CORS и безопасность
CORS_ENABLED=true
CORS_ORIGIN=https://stage.gprod.com,https://stage-admin.gprod.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Дополнительные настройки
APP_NAME=GPROD API (Staging)
APP_VERSION=1.0.0
HOST=localhost
DOMAIN=stage.gprod.com

# Postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gprod_stage

# Prometheus и Grafana
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=admin

# Инструментальные переменные
LOGGER_TEST_MODE=false
RUNNING_IN_DOCKER=false
EOL
print_success "Шаблон .env.staging создан"

# Создаем шаблон для production
print_step "Создание шаблона для production..."
cat > .env-templates/.env.production << 'EOL'
# Основные настройки окружения
NODE_ENV=production
PORT=3007

# База данных
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/gprod_prod

# JWT и авторизация
JWT_SECRET=super_secure_jwt_secret_for_production
JWT_EXPIRES=1h
JWT_REFRESH_EXPIRES=30d

# Логирование
LOG_LEVEL=info
DEBUG=false

# CORS и безопасность
CORS_ENABLED=true
CORS_ORIGIN=https://gprod.com,https://admin.gprod.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Дополнительные настройки
APP_NAME=GPROD API
APP_VERSION=1.0.0
HOST=localhost
DOMAIN=gprod.com

# Postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=super_secure_postgres_password
POSTGRES_DB=gprod_prod

# Redis для кэширования
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=super_secure_redis_password

# Prometheus и Grafana
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=super_secure_grafana_password

# Инструментальные переменные
LOGGER_TEST_MODE=false
RUNNING_IN_DOCKER=true
EOL
print_success "Шаблон .env.production создан"

# Создаем шаблон для тестового окружения
print_step "Создание шаблона для test..."
cat > .env-templates/.env.test << 'EOL'
# Основные настройки окружения для тестов
NODE_ENV=test
PORT=3009

# База данных для тестов
# Примечание: Для локальных тестов используйте localhost:5432, для Docker - db:5432
# EnvHelper автоматически выберет правильный URL в зависимости от окружения
DATABASE_URL=postgresql://postgres:postgres@db:5432/gprod_test

# Если используем докер напрямую - эти переменные будут переопределены через env
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gprod_test

# JWT и авторизация для тестов
JWT_SECRET=test_jwt_secret
TEST_JWT_SECRET=test_secret_key_for_testing_only
JWT_EXPIRES=1h
JWT_REFRESH_EXPIRES=7d

# Логирование (минимизируем в тестах)
LOG_LEVEL=error
DEBUG=false

# CORS и безопасность
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:3009
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=1000

# Дополнительные настройки
APP_NAME=GPROD API (Test)
APP_VERSION=1.0.0
HOST=localhost
DOMAIN=localhost

# Инструментальные переменные
LOGGER_TEST_MODE=true
RUNNING_IN_DOCKER=false
EOL
print_success "Шаблон .env.test создан"

print_subheader "🎯 Применение шаблонов"
print_info "Все шаблоны успешно созданы в директории .env-templates"

# Интерактивная настройка
print_subheader "⚙️ Настройка рабочего окружения"

# Проверка наличия .env* файлов в корне
if ls .env* 1> /dev/null 2>&1; then
    print_warning "В проекте уже есть .env файлы:"
    ls -la .env*
    
    read -p "$(echo -e $YELLOW"Хотите перезаписать существующие .env файлы? (y/n): "$NC)" overwrite
    
    if [[ "$overwrite" != "y" && "$overwrite" != "Y" ]]; then
        print_info "Cохраняем существующие .env файлы."
        
        # Проверим симлинк .env
        if [ -L ".env" ]; then
            ENV_TARGET=$(readlink .env)
            print_info "Текущий .env является симлинком на $ENV_TARGET"
        elif [ -f ".env" ]; then
            print_warning ".env является обычным файлом, а не симлинком"
        else
            print_warning ".env не найден"
        fi
        
        exit 0
    fi
fi

# Определяем, какой контур установить по умолчанию
print_info "Выберите контур для использования по умолчанию:"
select env_type in "development" "staging" "production" "test"; do
    case $env_type in
        development)
            DEFAULT_ENV="development"
            ENV_FILE=".env.development"
            break
            ;;
        staging)
            DEFAULT_ENV="staging"
            ENV_FILE=".env.staging"
            break
            ;;
        production)
            DEFAULT_ENV="production"
            ENV_FILE=".env.production"
            break
            ;;
        test)
            DEFAULT_ENV="test"
            ENV_FILE=".env.test"
            break
            ;;
        *)
            print_error "Некорректный выбор"
            ;;
    esac
done

# Копируем шаблоны для всех контуров
for env in development staging production test; do
    src=".env-templates/.env.${env}"
    dest=".env.${env}"
    
    if [ -f "$src" ]; then
        cp "$src" "$dest"
        print_success "Файл $dest создан"
    else
        print_error "Шаблон $src не найден"
    fi
done

# Создаем симлинк на выбранный файл
ln -sf "$ENV_FILE" .env
print_success "Файл .env установлен как симлинк на $ENV_FILE"

# Определяем режим запуска
if [ "$DOCKER_AVAILABLE" = true ]; then
    print_info "Выберите режим запуска по умолчанию:"
    select run_mode in "Docker" "Локально"; do
        case $run_mode in
            Docker)
                USE_DOCKER=true
                break
                ;;
            Локально)
                USE_DOCKER=false
                break
                ;;
            *)
                print_error "Некорректный выбор"
                ;;
        esac
    done
else
    USE_DOCKER=false
fi

# Адаптация для выбранного режима
for env_file in .env.development .env.staging .env.production .env.test; do
    if [ -f "$env_file" ]; then
        if [ "$USE_DOCKER" = true ]; then
            # Для Docker (db:5432)
            "${SED_INPLACE[@]}" 's/localhost:5432/db:5432/g' "$env_file"
            "${SED_INPLACE[@]}" 's/RUNNING_IN_DOCKER=false/RUNNING_IN_DOCKER=true/g' "$env_file"
            print_success "Файл $env_file адаптирован для Docker"
        else
            # Для локальной разработки (localhost:5432)
            "${SED_INPLACE[@]}" 's/db:5432/localhost:5432/g' "$env_file"
            "${SED_INPLACE[@]}" 's/RUNNING_IN_DOCKER=true/RUNNING_IN_DOCKER=false/g' "$env_file"
            print_success "Файл $env_file адаптирован для локальной разработки"
        fi
        
        # MacOS fix for sed
        if [ "$OS_TYPE" = "MacOS" ]; then
            rm -f "${env_file}.bak" 2>/dev/null
        fi
    fi
done

# Создание пользовательской базовой конфигурации
print_subheader "🔧 Создание пользовательской конфигурации"
print_info "Хотите настроить дополнительные параметры для $ENV_FILE?"
select customize in "Да" "Нет"; do
    case $customize in
        Да)
            # Порт
            read -p "$(echo -e $BLUE"Порт для API (оставьте пустым для значения по умолчанию): "$NC)" custom_port
            if [ ! -z "$custom_port" ]; then
                "${SED_INPLACE[@]}" "s/PORT=[0-9]*/PORT=$custom_port/" "$ENV_FILE"
                print_success "Порт установлен: $custom_port"
            fi
            
            # JWT Secret
            read -p "$(echo -e $BLUE"JWT Secret (оставьте пустым для значения по умолчанию): "$NC)" custom_jwt
            if [ ! -z "$custom_jwt" ]; then
                "${SED_INPLACE[@]}" "s/JWT_SECRET=.*/JWT_SECRET=$custom_jwt/" "$ENV_FILE"
                print_success "JWT Secret обновлен"
            fi
            
            # Режим отладки
            read -p "$(echo -e $BLUE"Включить режим отладки? (y/n): "$NC)" debug_mode
            if [[ "$debug_mode" == "y" || "$debug_mode" == "Y" ]]; then
                "${SED_INPLACE[@]}" "s/DEBUG=false/DEBUG=true/" "$ENV_FILE"
                print_success "Режим отладки включен"
            fi
            
            # MacOS fix for sed
            if [ "$OS_TYPE" = "MacOS" ]; then
                rm -f "${ENV_FILE}.bak" 2>/dev/null
            fi
            break
            ;;
        Нет)
            print_info "Используем значения по умолчанию"
            break
            ;;
        *)
            print_error "Некорректный выбор"
            ;;
    esac
done

print_header "✅ Настройка окружения завершена успешно!"
print_info "Текущий контур: ${BOLD}$DEFAULT_ENV${NC}"
print_info "Режим запуска: ${BOLD}$([ "$USE_DOCKER" = true ] && echo "Docker" || echo "Локальный")${NC}"
print_info "Основной .env файл: ${BOLD}$ENV_FILE${NC}"

print_subheader "🚀 Что делать дальше?"
print_step "Запустить приложение в режиме разработки: ${BOLD}pnpm run start:dev${NC}"
print_step "Запустить с Docker: ${BOLD}pnpm run docker:reference${NC}"
print_step "Переключить контур: ${BOLD}pnpm run env:switch:new <dev|stage|prod> [--docker|--local]${NC}"

# Предложение сразу запустить приложение
print_subheader "🏃 Быстрый запуск"
read -p "$(echo -e $YELLOW"Хотите запустить приложение сейчас? (y/n): "$NC)" should_run

if [[ "$should_run" == "y" || "$should_run" == "Y" ]]; then
    if [ "$USE_DOCKER" = true ]; then
        print_info "Запускаем с Docker..."
        if [ -f "docker-compose.reference.yml" ]; then
            docker compose -f docker-compose.reference.yml up -d
        else
            print_error "Файл docker-compose.reference.yml не найден"
        fi
    else
        print_info "Запускаем локально..."
        case $DEFAULT_ENV in
            development)
                LOGGER_TEST_MODE=true pnpm run start:dev
                ;;
            staging)
                pnpm run start:stage
                ;;
            production)
                pnpm run start:prod
                ;;
            test)
                pnpm run test:smart
                ;;
        esac
    fi
fi 