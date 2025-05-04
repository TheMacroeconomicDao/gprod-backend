#!/bin/bash

# ===================================================
# 🚀 GPROD Automation Script
# ===================================================
# Главный скрипт для управления автоматизацией проекта
#
# Использование:
#   ./automation/run.sh <команда> [контур]
#
# Команды:
#   env   - настройка окружения
#   run   - запуск окружения (настройка + запуск Docker)
#   stop  - остановка окружения
#   logs  - просмотр логов
#   test  - запуск тестов
#
# Контуры:
#   dev, stage, prod, reference

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
ENV_MANAGER="$SCRIPT_DIR/env/env-manager.sh"
DOCKER_MANAGER="$PROJECT_ROOT/docker/docker-manager.sh"
TEST_SCRIPT="$SCRIPT_DIR/scripts/run-tests.sh"

# Проверка наличия параметров
if [ $# -lt 1 ]; then
  print_header "🚀 GPROD Automation Script"
  print_error "Не указана команда"
  print_info "Использование: ./automation/run.sh <команда> [контур]"
  print_info "Команды: env, run, stop, logs, test"
  print_info "Контуры: dev, stage, prod, reference"
  exit 1
fi

COMMAND=$1
ENV=${2:-dev}  # По умолчанию используем dev

# Проверка наличия флага --rebuild
REBUILD=false
for arg in "$@"; do
  if [ "$arg" = "--rebuild" ]; then
    REBUILD=true
    break
  fi
done

# Выполнение команды
case $COMMAND in
  env)
    print_header "🌟 Настройка окружения: $ENV"
    bash "$ENV_MANAGER" "$ENV" "$3" "$4"
    ;;
  run)
    print_header "🚀 Запуск окружения: $ENV"
    print_step "Настройка окружения..."
    bash "$ENV_MANAGER" "$ENV" --silent --docker
    
    print_step "Запуск Docker контейнеров..."
    
    # Проверка флага --rebuild
    if [ "$REBUILD" = true ]; then
      print_info "Режим принудительной пересборки активирован"
      bash "$DOCKER_MANAGER" "$ENV" up --build
    else
      bash "$DOCKER_MANAGER" "$ENV" up
    fi
    ;;
  stop)
    print_header "🛑 Остановка окружения: $ENV"
    bash "$DOCKER_MANAGER" "$ENV" down
    ;;
  logs)
    print_header "📋 Просмотр логов: $ENV"
    bash "$DOCKER_MANAGER" "$ENV" logs
    ;;
  test)
    print_header "🧪 Запуск тестов"
    if [ "$ENV" = "unit" ] || [ "$ENV" = "e2e" ]; then
      # Если второй параметр - тип теста
      bash "$TEST_SCRIPT" "$ENV" "${@:3}"
    else
      # Запуск всех тестов
      bash "$TEST_SCRIPT" "${@:2}"
    fi
    ;;
  *)
    print_error "Неизвестная команда: $COMMAND"
    print_info "Доступные команды: env, run, stop, logs, test"
    exit 1
    ;;
esac

exit 0