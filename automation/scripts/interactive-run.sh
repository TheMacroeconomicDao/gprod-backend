#!/bin/bash

# ===================================================
# 🚀 GPROD Интерактивный запуск
# ===================================================
# Интерактивный скрипт для запуска проекта с выбором режима
#
# Использование:
#   ./automation/scripts/interactive-run.sh

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
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../" && pwd)"
RUN_SCRIPT="$PROJECT_ROOT/automation/run.sh"

# Функция для отображения меню
show_menu() {
  print_header "🚀 GPROD Интерактивный запуск"
  echo -e "${CYAN}Выберите контур:${NC}"
  echo -e "  ${YELLOW}1)${NC} Development (dev) - для локальной разработки"
  echo -e "  ${YELLOW}2)${NC} Staging (stage) - для тестирования"
  echo -e "  ${YELLOW}3)${NC} Production (prod) - для продакшена"
  echo -e "  ${YELLOW}4)${NC} Reference - минимальная конфигурация"
  echo -e "\n${CYAN}Режим запуска:${NC}"
  echo -e "  ${YELLOW}a)${NC} Обычный запуск (использовать существующие образы, если есть)"
  echo -e "  ${YELLOW}b)${NC} С пересборкой (принудительная пересборка образов)"
  echo -e "\n${CYAN}Дополнительные опции:${NC}"
  echo -e "  ${YELLOW}q)${NC} Выход"
  echo -e "\n${CYAN}Введите комбинацию (например, 1a для обычного запуска dev):${NC} "
}

# Функция для запуска проекта
run_project() {
  local env=$1
  local rebuild=$2
  
  if [ "$rebuild" = true ]; then
    print_step "Запуск $env с принудительной пересборкой..."
    bash "$RUN_SCRIPT" run "$env" --rebuild
  else
    print_step "Запуск $env в обычном режиме..."
    bash "$RUN_SCRIPT" run "$env"
  fi
}

# Основной код
show_menu
read -r choice

# Определение контура
env=""
case ${choice:0:1} in
  1)
    env="dev"
    ;;
  2)
    env="stage"
    ;;
  3)
    env="prod"
    ;;
  4)
    env="reference"
    ;;
  q)
    print_info "Выход из программы"
    exit 0
    ;;
  *)
    print_error "Неверный выбор контура"
    exit 1
    ;;
esac

# Определение режима запуска
rebuild=false
case ${choice:1:1} in
  a)
    rebuild=false
    ;;
  b)
    rebuild=true
    ;;
  *)
    print_error "Неверный выбор режима запуска"
    exit 1
    ;;
esac

# Запуск проекта
run_project "$env" "$rebuild"
