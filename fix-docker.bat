@echo off
REM Script para corrigir problemas comuns do DigiBank Docker no Windows

echo 🔧 DigiBank - Script de Correcao de Problemas
echo ==============================================

REM Verificar se Docker está rodando
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker nao esta rodando. Por favor, inicie o Docker primeiro.
    exit /b 1
)

echo [INFO] Parando containers existentes...
docker-compose down -v

echo [INFO] Limpando cache do Docker...
docker system prune -f

echo [INFO] Removendo imagens antigas do DigiBank...
for /f "tokens=3" %%i in ('docker images ^| findstr digibank') do docker rmi %%i 2>nul

echo [INFO] Baixando imagens Node.js mais recentes...
docker pull node:20-alpine
docker pull postgres:15-alpine

echo [WARNING] Isto pode levar alguns minutos...
echo [INFO] Reconstruindo containers com cache limpo...
docker-compose build --no-cache

echo [INFO] Iniciando containers...
docker-compose up -d

echo [INFO] Aguardando servicos ficarem prontos...
timeout /t 15 /nobreak >nul

REM Verificar se os serviços estão rodando
docker-compose ps | findstr "Up" >nul
if not errorlevel 1 (
    echo [SUCCESS] ✅ Containers iniciados com sucesso!
    echo.
    echo [INFO] Servicos disponiveis:
    echo [INFO]   Frontend: http://localhost:5173
    echo [INFO]   Backend: http://localhost:3001
    echo [INFO]   PostgreSQL: localhost:5432
    echo.
    echo [INFO] Para ver logs em tempo real: docker-compose logs -f
) else (
    echo [ERROR] ❌ Alguns containers nao iniciaram corretamente.
    echo [INFO] Execute 'docker-compose logs -f' para ver os logs.
)
