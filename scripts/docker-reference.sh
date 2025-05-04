#!/bin/bash

# Скрипт для запуска минимальной конфигурации Docker для разработки

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция вывода сообщения
function echo_message() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

# Функция вывода сообщения об успехе
function echo_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Функция вывода сообщения об ошибке
function echo_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Функция вывода предупреждения
function echo_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Проверяем, существует ли файл docker-compose.reference.yml
if [ ! -f "docker-compose.reference.yml" ]; then
  echo_error "Файл docker-compose.reference.yml не найден!"
  exit 1
fi

# Определяем команду
ACTION=${1:-"up"}

case "$ACTION" in
  up)
    echo_message "🚀 Запускаем минимальную конфигурацию для разработки..."
    docker-compose -f docker-compose.reference.yml up -d
    
    # Проверяем статус
    if [ $? -eq 0 ]; then
      echo_success "✅ Минимальная конфигурация успешно запущена!"
      echo_message "📋 Статус запущенных контейнеров:"
      docker-compose -f docker-compose.reference.yml ps
      
      # Информация о доступных сервисах
      echo_message "🔗 API доступен по адресу: http://localhost:3000"
      echo_message "🔗 База данных доступна на порту: 5432"
    else
      echo_error "❌ Не удалось запустить контейнеры!"
    fi
    ;;
    
  down)
    echo_message "📦 Останавливаем контейнеры..."
    docker-compose -f docker-compose.reference.yml down
    
    if [ $? -eq 0 ]; then
      echo_success "✅ Контейнеры успешно остановлены!"
    else
      echo_error "❌ Не удалось остановить контейнеры!"
    fi
    ;;
    
  restart)
    echo_message "🔄 Перезапускаем контейнеры..."
    docker-compose -f docker-compose.reference.yml down
    docker-compose -f docker-compose.reference.yml up -d
    
    if [ $? -eq 0 ]; then
      echo_success "✅ Контейнеры успешно перезапущены!"
      echo_message "📋 Статус запущенных контейнеров:"
      docker-compose -f docker-compose.reference.yml ps
      
      # Информация о доступных сервисах
      echo_message "🔗 API доступен по адресу: http://localhost:3000"
      echo_message "🔗 База данных доступна на порту: 5432"
    else
      echo_error "❌ Не удалось перезапустить контейнеры!"
    fi
    ;;
    
  logs)
    echo_message "📋 Выводим логи контейнеров..."
    docker-compose -f docker-compose.reference.yml logs -f
    ;;
    
  build)
    echo_message "🔨 Пересобираем контейнеры..."
    docker-compose -f docker-compose.reference.yml build
    docker-compose -f docker-compose.reference.yml up -d
    
    if [ $? -eq 0 ]; then
      echo_success "✅ Контейнеры успешно пересобраны и запущены!"
      echo_message "📋 Статус запущенных контейнеров:"
      docker-compose -f docker-compose.reference.yml ps
    else
      echo_error "❌ Не удалось пересобрать контейнеры!"
    fi
    ;;
    
  *)
    echo_error "❌ Неизвестная команда: $ACTION"
    echo_message "Доступные команды:"
    echo_message "  up      - запустить контейнеры"
    echo_message "  down    - остановить контейнеры"
    echo_message "  restart - перезапустить контейнеры"
    echo_message "  logs    - показать логи"
    echo_message "  build   - пересобрать и запустить контейнеры"
    exit 1
    ;;
esac

echo_message "💡 Для управления полной инфраструктурой используйте репозиторий gybernaty-infra"
echo_message "    Документация: docs/split-infrastructure.md" 