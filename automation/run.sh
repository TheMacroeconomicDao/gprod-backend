#!/bin/bash

# ===================================================
# 🚀 GPROD Automation Runner
# ===================================================
# Универсальный скрипт для управления автоматизацией
# 
# Использование:
#   ./run.sh <команда> [аргументы]
#
# Команды:
#   env <dev|stage|prod>  - настройка окружения
#   run <dev|stage|prod>  - запуск контура
#   stop <dev|stage|prod> - остановка контура
#   logs <dev|stage|prod> - просмотр логов контура
#   test                  - запуск тестов
#   help                  - показать помощь

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

# Получение каталога скрипта
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/docker"
ENV_DIR="$SCRIPT_DIR/env"
SCRIPTS_DIR="$SCRIPT_DIR/scripts"

# Функция для показа помощи
show_help() {
  print_header "🚀 GPROD Automation Runner"
  print_info "Использование: ./run.sh <команда> [аргументы]"
  print_info "Команды:"
  print_info "  env <dev|stage|prod>  - настройка окружения"
  print_info "  run <dev|stage|prod>  - запуск контура"
  print_info "  stop <dev|stage|prod> - остановка контура"
  print_info "  logs <dev|stage|prod> - просмотр логов контура"
  print_info "  test                  - запуск тестов"
  print_info "  help                  - показать помощь"
  print_info "Примеры:"
  print_info "  ./run.sh env dev      - настройка development окружения"
  print_info "  ./run.sh run stage    - запуск staging контура"
  print_info "  ./run.sh stop prod    - остановка production контура"
}

# Проверка наличия параметров
if [ $# -lt 1 ]; then
  show_help
  exit 1
fi

# Обработка команды
COMMAND=$1
shift

case $COMMAND in
  env)
    # Настройка окружения
    if [ $# -lt 1 ]; then
      print_error "Не указан контур окружения"
      print_info "Использование: ./run.sh env <dev|stage|prod>"
      exit 1
    fi
    ENV=$1
    print_header "🌟 Настройка окружения $ENV"
    bash "$ENV_DIR/env-manager.sh" "$ENV" "$@"
    ;;
  
  run)
    # Запуск контура
    if [ $# -lt 1 ]; then
      print_error "Не указан контур для запуска"
      print_info "Использование: ./run.sh run <dev|stage|prod>"
      exit 1
    fi
    ENV=$1
    print_header "🚀 Запуск контура $ENV"
    
    # Настраиваем окружение (тихий режим)
    bash "$ENV_DIR/env-manager.sh" "$ENV" --silent
    
    # Запускаем Docker
    bash "$DOCKER_DIR/docker-manager.sh" "$ENV" up
    ;;
  
  stop)
    # Остановка контура
    if [ $# -lt 1 ]; then
      print_error "Не указан контур для остановки"
      print_info "Использование: ./run.sh stop <dev|stage|prod>"
      exit 1
    fi
    ENV=$1
    print_header "🛑 Остановка контура $ENV"
    
    # Запускаем команду остановки
    bash "$DOCKER_DIR/docker-manager.sh" "$ENV" down
    ;;
  
  logs)
    # Просмотр логов
    if [ $# -lt 1 ]; then
      print_error "Не указан контур для просмотра логов"
      print_info "Использование: ./run.sh logs <dev|stage|prod>"
      exit 1
    fi
    ENV=$1
    print_header "📋 Просмотр логов контура $ENV"
    
    # Запускаем просмотр логов
    bash "$DOCKER_DIR/docker-manager.sh" "$ENV" logs
    ;;
  
  test)
    # Запуск тестов
    print_header "🧪 Запуск тестов"
    
    # Если есть наш скрипт для тестов, используем его
    if [ -f "$SCRIPTS_DIR/run-tests.sh" ]; then
      bash "$SCRIPTS_DIR/run-tests.sh"
    else
      # Иначе используем основной скрипт из проекта
      cd "$PROJECT_ROOT"
      pnpm run test:smart
    fi
    ;;
  
  help)
    # Показать помощь
    show_help
    ;;
  
  *)
    # Неизвестная команда
    print_error "Неизвестная команда: $COMMAND"
    show_help
    exit 1
    ;;
esac

exit 0 