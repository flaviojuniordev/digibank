#!/bin/bash

# Script para facilitar o gerenciamento do DigiBank com Docker

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}[DigiBank]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Verificar se Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker não está instalado. Por favor, instale o Docker primeiro."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
        exit 1
    fi
}

# Verificar se arquivo .env existe
check_env() {
    if [ ! -f .env ]; then
        print_warning "Arquivo .env não encontrado. Criando a partir do .env.example..."
        cp .env.example .env
        print_message "Arquivo .env criado! Você pode editá-lo se necessário."
    fi
}

# Iniciar aplicação
start() {
    print_message "Iniciando DigiBank..."
    check_docker
    check_env
    
    docker-compose up --build -d
    
    print_message "Aguardando serviços ficarem prontos..."
    sleep 10
    
    print_message "✅ DigiBank iniciado com sucesso!"
    print_info "Frontend: http://localhost:5173"
    print_info "Backend: http://localhost:3001"
    print_info "PostgreSQL: localhost:5432"
    
    print_info "Dados de teste disponíveis:"
    print_info "  Email: joao@exemplo.com | Senha: 123456"
    print_info "  Email: contato@mariaempresa.com | Senha: 123456"
}

# Parar aplicação
stop() {
    print_message "Parando DigiBank..."
    docker-compose down
    print_message "✅ DigiBank parado com sucesso!"
}

# Reiniciar aplicação
restart() {
    print_message "Reiniciando DigiBank..."
    stop
    start
}

# Mostrar logs
logs() {
    print_message "Mostrando logs do DigiBank..."
    docker-compose logs -f
}

# Limpar dados
clean() {
    print_warning "⚠️  Isso irá remover TODOS os dados do banco de dados!"
    read -p "Tem certeza? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_message "Limpando dados do DigiBank..."
        docker-compose down -v
        docker system prune -f
        print_message "✅ Dados limpos com sucesso!"
    else
        print_message "Operação cancelada."
    fi
}

# Status dos serviços
status() {
    print_message "Status dos serviços:"
    docker-compose ps
}

# Backup do banco de dados
backup() {
    print_message "Fazendo backup do banco de dados..."
    mkdir -p backups
    backup_file="backups/digibank_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    docker-compose exec -T postgres pg_dump -U postgres banco_digital > "$backup_file"
    print_message "✅ Backup salvo em: $backup_file"
}

# Mostrar ajuda
help() {
    echo -e "${GREEN}DigiBank - Sistema Bancário Digital${NC}"
    echo ""
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start     Iniciar a aplicação"
    echo "  stop      Parar a aplicação"
    echo "  restart   Reiniciar a aplicação"
    echo "  logs      Mostrar logs em tempo real"
    echo "  status    Mostrar status dos serviços"
    echo "  clean     Limpar todos os dados (CUIDADO!)"
    echo "  backup    Fazer backup do banco de dados"
    echo "  help      Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 start    # Iniciar DigiBank"
    echo "  $0 logs     # Ver logs em tempo real"
    echo "  $0 backup   # Fazer backup do banco"
}

# Verificar argumento
case "${1:-help}" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs
        ;;
    status)
        status
        ;;
    clean)
        clean
        ;;
    backup)
        backup
        ;;
    help|--help|-h)
        help
        ;;
    *)
        print_error "Comando desconhecido: $1"
        help
        exit 1
        ;;
esac
