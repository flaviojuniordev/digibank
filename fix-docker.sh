#!/bin/bash

# Script para corrigir problemas comuns do DigiBank Docker

echo "🔧 DigiBank - Script de Correção de Problemas"
echo "=============================================="

# Função para imprimir mensagens
print_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

print_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

print_warning() {
    echo -e "\033[1;33m[WARNING]\033[0m $1"
}

print_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1"
}

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    print_error "Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

print_info "Parando containers existentes..."
docker-compose down -v

print_info "Limpando cache do Docker..."
docker system prune -f

print_info "Removendo imagens antigas do DigiBank..."
docker rmi $(docker images | grep digibank | awk '{print $3}') 2>/dev/null || true

print_info "Baixando imagens Node.js mais recentes..."
docker pull node:20-alpine
docker pull postgres:15-alpine

print_warning "Isto pode levar alguns minutos..."
print_info "Reconstruindo containers com cache limpo..."
docker-compose build --no-cache

print_info "Iniciando containers..."
docker-compose up -d

print_info "Aguardando serviços ficarem prontos..."
sleep 15

# Verificar se os serviços estão rodando
if docker-compose ps | grep -q "Up"; then
    print_success "✅ Containers iniciados com sucesso!"
    echo ""
    print_info "Serviços disponíveis:"
    print_info "  Frontend: http://localhost:5173"
    print_info "  Backend: http://localhost:3001"
    print_info "  PostgreSQL: localhost:5432"
    echo ""
    print_info "Para ver logs em tempo real: docker-compose logs -f"
else
    print_error "❌ Alguns containers não iniciaram corretamente."
    print_info "Execute 'docker-compose logs -f' para ver os logs."
fi
