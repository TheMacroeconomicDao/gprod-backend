#!/bin/bash

# ===================================================
# ud83dudcdc GPROD Menu Library
# ===================================================
# u0411u0438u0431u043bu0438u043eu0442u0435u043au0430 u0434u043bu044f u0441u043eu0437u0434u0430u043du0438u044f u0438u043du0442u0435u0440u0430u043au0442u0438u0432u043du044bu0445 u043cu0435u043du044e u0432 u0441u043au0440u0438u043fu0442u0430u0445 bash
#
# u0418u0441u043fu043eu043bu044cu0437u043eu0432u0430u043du0438u0435:
#   source ./automation/lib/menu-lib.sh

# u041fu0440u043eu0432u0435u0440u043au0430 u043du0430u043bu0438u0447u0438u044f u043du0435u043eu0431u0445u043eu0434u0438u043cu044bu0445 u0443u0442u0438u043bu0438u0442
if ! command -v tput &> /dev/null; then
  echo "u041eu0448u0438u0431u043au0430: u0443u0442u0438u043bu0438u0442u0430 'tput' u043du0435 u043du0430u0439u0434u0435u043du0430. u0423u0441u0442u0430u043du043eu0432u0438u0442u0435 u043fu0430u043au0435u0442 'ncurses'."
  return 1 2>/dev/null || exit 1
fi

# u0426u0432u0435u0442u0430 u0434u043bu044f u0432u044bu0432u043eu0434u0430
MENU_GREEN='\033[0;32m'
MENU_RED='\033[0;31m'
MENU_YELLOW='\033[1;33m'
MENU_BLUE='\033[0;34m'
MENU_PURPLE='\033[0;35m'
MENU_CYAN='\033[0;36m'
MENU_WHITE='\033[1;37m'
MENU_BOLD='\033[1m'
MENU_BG_GREEN='\033[42m'
MENU_BG_BLUE='\033[44m'
MENU_BG_CYAN='\033[46m'
MENU_BG_GRAY='\033[100m'
MENU_NC='\033[0m' # No Color

# u0424u0443u043du043au0446u0438u0438 u0434u043bu044f u0432u044bu0432u043eu0434u0430
menu_print_header() {
  echo -e "\n${MENU_WHITE}${MENU_BOLD}$1${MENU_NC}\n"
}

menu_print_success() {
  echo -e "${MENU_GREEN}u2713 $1${MENU_NC}"
}

menu_print_error() {
  echo -e "${MENU_RED}u2717 $1${MENU_NC}"
}

menu_print_info() {
  echo -e "${MENU_BLUE}u2139 $1${MENU_NC}"
}

menu_print_step() {
  echo -e "${MENU_PURPLE}u2192 $1${MENU_NC}"
}

# u0424u0443u043du043au0446u0438u044f u0434u043bu044f u043eu0442u043eu0431u0440u0430u0436u0435u043du0438u044f u043fu0440u043eu0433u0440u0435u0441u0441-u0431u0430u0440u0430
menu_show_progress() {
  local progress=$1
  local total=$2
  local width=40
  local percentage=$((progress * 100 / total))
  local completed=$((progress * width / total))
  local remaining=$((width - completed))
  
  printf "[${MENU_GREEN}"
  printf "%${completed}s" | tr ' ' 'u2588'
  printf "${MENU_NC}%${remaining}s] %d%%" | tr ' ' 'u2591' "$percentage"
  echo -ne "\r"
}

# u0424u0443u043du043au0446u0438u044f u0434u043bu044f u043eu0447u0438u0441u0442u043au0438 u0441u0442u0440u043eu043au0438
menu_clear_line() {
  tput el
}

# u0424u0443u043du043au0446u0438u044f u0434u043bu044f u043fu0435u0440u0435u043cu0435u0449u0435u043du0438u044f u043au0443u0440u0441u043eu0440u0430 u0432u0432u0435u0440u0445 u043du0430 n u0441u0442u0440u043eu043a
menu_cursor_up() {
  tput cuu $1
}

# u0424u0443u043du043au0446u0438u044f u0434u043bu044f u043fu0435u0440u0435u043cu0435u0449u0435u043du0438u044f u043au0443u0440u0441u043eu0440u0430 u0432u043du0438u0437 u043du0430 n u0441u0442u0440u043eu043a
menu_cursor_down() {
  tput cud $1
}

# u0424u0443u043du043au0446u0438u044f u0434u043bu044f u0441u043eu0445u0440u0430u043du0435u043du0438u044f u043fu043eu0437u0438u0446u0438u0438 u043au0443u0440u0441u043eu0440u0430
menu_save_cursor() {
  tput sc
}

# u0424u0443u043du043au0446u0438u044f u0434u043bu044f u0432u043eu0441u0441u0442u0430u043du043eu0432u043bu0435u043du0438u044f u043fu043eu0437u0438u0446u0438u0438 u043au0443u0440u0441u043eu0440u0430
menu_restore_cursor() {
  tput rc
}

# u0424u0443u043du043au0446u0438u044f u0434u043bu044f u0441u043au0440u044bu0442u0438u044f u043au0443u0440u0441u043eu0440u0430
menu_hide_cursor() {
  tput civis
}

# u0424u0443u043du043au0446u0438u044f u0434u043bu044f u043fu043eu043au0430u0437u0430 u043au0443u0440u0441u043eu0440u0430
menu_show_cursor() {
  tput cnorm
}
