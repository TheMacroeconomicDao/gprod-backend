#!/bin/bash

# ===================================================
# 🚀 GPROD Docker Manager
# ===================================================
# Универсальный скрипт для управления Docker контейнерами
#
# Использование:
#   ./docker-manager.sh <контур> <команда> [--build]
#
# Контуры:
#   dev, stage, prod, reference
#
# Команды:
#   up     - запустить контейнеры
#   down   - остановить контейнеры
#   restart - перезапустить контейнеры
#   logs   - показать логи
#   ps     - показать статус контейнеров
#
# Примеры:
#   ./docker-manager.sh dev up        # Запустить development контур
#   ./docker-manager.sh stage down    # Остановить staging контур
#   ./docker-manager.sh prod restart  # Перезапустить production контур
#   ./docker-manager.sh reference up  # Запустить минимальную reference конфигурацию

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Функции для вывода
print_header() {
  echo -e "\n${WHITE}${BOLD}$1${NC}\n"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ $1${NC}"
}

print_step() {
  echo -e "${PURPLE}→ $1${NC}"
}

# Получение директорий
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../" && pwd)"

# Проверка наличия параметров
if [ $# -lt 2 ]; then
  print_header "🚀 GPROD Docker Manager"
  print_error "Не указан контур и/или команда"
  print_info "Использование: ./docker-manager.sh <контур> <команда>"
  print_info "Контуры: dev, stage, prod, reference"
  print_info "Команды: up, down, restart, logs, ps"
  exit 1
fi

ENV=$1
ACTION=$2
BUILD=false

# Проверка дополнительных параметров
if [ "$3" = "--build" ]; then
  BUILD=true
fi

# Определение файла docker-compose в зависимости от контура
case $ENV in
  dev|development)
    COMPOSE_FILE="$SCRIPT_DIR/docker-compose.dev.yml"
    ENV_NAME="development"
    PORT=3008
    ;;
  stage|staging)
    COMPOSE_FILE="$SCRIPT_DIR/docker-compose.stage.yml"
    ENV_NAME="staging"
    PORT=3003
    ;;
  prod|production)
    COMPOSE_FILE="$SCRIPT_DIR/docker-compose.prod.yml"
    ENV_NAME="production"
    PORT=3007
    ;;
  reference)
    COMPOSE_FILE="$SCRIPT_DIR/docker-compose.reference.yml"
    ENV_NAME="reference (minimal)"
    PORT=3000
    ;;
  *)
    print_error "Неизвестный контур: $ENV"
    print_info "Поддерживаемые контуры: dev, stage, prod, reference"
    exit 1
    ;;
esac

# Проверка наличия файла docker-compose
if [ ! -f "$COMPOSE_FILE" ]; then
  print_error "Файл $COMPOSE_FILE не найден!"
  exit 1
fi

# Выполнение команды
case "$ACTION" in
  up)
    print_header "🚀 Запуск контура $ENV_NAME"
    
    if [ "$BUILD" = true ]; then
      print_step "Запускаем с пересборкой..."
      cd $PROJECT_ROOT && docker compose -f "$COMPOSE_FILE" up -d --build
    else
      print_step "Запускаем без пересборки..."
      cd $PROJECT_ROOT && docker compose -f "$COMPOSE_FILE" up -d
    fi
    
    # Проверка статуса
    if [ $? -eq 0 ]; then
      print_success "Контейнеры успешно запущены"
      
      # Вывод информации о сервисах
      print_header "🔗 Доступные сервисы"
      print_info "API: http://localhost:$PORT/api/v1"
      print_info "Swagger: http://localhost:$PORT/api/v1/docs"
      
      # Дополнительные сервисы
      case $ENV_NAME in
        staging)
          print_info "Prometheus: http://localhost:9090"
          print_info "Grafana: http://localhost:3100"
          ;;
        production)
          print_info "Grafana: http://localhost:3500"
          ;;
      esac
      
      # Вывод запущенных контейнеров
      print_step "Запущенные контейнеры:"
      docker ps --filter "name=gprod-*" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    else
      print_error "Ошибка запуска контейнеров"
    fi
    ;;
    
  down)
    print_header "📦 Остановка контура $ENV_NAME"
    cd $PROJECT_ROOT && docker compose -f "$COMPOSE_FILE" down
    
    if [ $? -eq 0 ]; then
      print_success "Контейнеры успешно остановлены"
    else
      print_error "Ошибка остановки контейнеров"
    fi
    ;;
    
  restart)
    print_header "🔄 Перезапуск контура $ENV_NAME"
    cd $PROJECT_ROOT && docker compose -f "$COMPOSE_FILE" down
    
    if [ "$BUILD" = true ]; then
      print_step "Перезапускаем с пересборкой..."
      cd $PROJECT_ROOT && docker compose -f "$COMPOSE_FILE" up -d --build
    else
      print_step "Перезапускаем без пересборки..."
      cd $PROJECT_ROOT && docker compose -f "$COMPOSE_FILE" up -d
    fi
    
    if [ $? -eq 0 ]; then
      print_success "Контейнеры успешно перезапущены"
      
      # Вывод информации о сервисах
      print_header "🔗 Доступные сервисы"
      print_info "API: http://localhost:$PORT/api/v1"
      print_info "Swagger: http://localhost:$PORT/api/v1/docs"
      
      # Вывод запущенных контейнеров
      print_step "Запущенные контейнеры:"
      docker ps --filter "name=gprod-*" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    else
      print_error "Ошибка перезапуска контейнеров"
    fi
    ;;
    
  logs)
    print_header "📋 Просмотр логов контура $ENV_NAME"
    cd $PROJECT_ROOT && docker compose -f "$COMPOSE_FILE" logs -f
    ;;
    
  ps)
    print_header "📊 Статус контейнеров контура $ENV_NAME"
    cd $PROJECT_ROOT && docker compose -f "$COMPOSE_FILE" ps
    ;;
    
  *)
    print_error "Неизвестная команда: $ACTION"
    print_info "Поддерживаемые команды: up, down, restart, logs, ps"
    exit 1
    ;;
esac

print_info "💡 Для управления полной инфраструктурой используйте репозиторий gybernaty-infra"
print_info "    Документация: docs/split-infrastructure.md"

exit 0 