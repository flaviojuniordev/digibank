@echo off
REM Script para facilitar o gerenciamento do DigiBank com Docker no Windows

setlocal enabledelayedexpansion

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker nao esta instalado. Por favor, instale o Docker primeiro.
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose nao esta instalado. Por favor, instale o Docker Compose primeiro.
    exit /b 1
)

REM Verificar se arquivo .env existe
if not exist .env (
    echo [WARNING] Arquivo .env nao encontrado. Criando a partir do .env.example...
    copy .env.example .env >nul
    echo [DigiBank] Arquivo .env criado! Voce pode edita-lo se necessario.
)

REM Verificar comando
if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="restart" goto restart
if "%1"=="logs" goto logs
if "%1"=="status" goto status
if "%1"=="clean" goto clean
if "%1"=="backup" goto backup
if "%1"=="help" goto help
if "%1"=="" goto help

echo [ERROR] Comando desconhecido: %1
goto help

:start
echo [DigiBank] Iniciando DigiBank...
docker-compose up --build -d
timeout /t 10 /nobreak >nul
echo [DigiBank] ✅ DigiBank iniciado com sucesso!
echo [INFO] Frontend: http://localhost:5173
echo [INFO] Backend: http://localhost:3001
echo [INFO] PostgreSQL: localhost:5432
echo [INFO] Dados de teste disponiveis:
echo [INFO]   Email: joao@exemplo.com ^| Senha: 123456
echo [INFO]   Email: contato@mariaempresa.com ^| Senha: 123456
goto end

:stop
echo [DigiBank] Parando DigiBank...
docker-compose down
echo [DigiBank] ✅ DigiBank parado com sucesso!
goto end

:restart
echo [DigiBank] Reiniciando DigiBank...
call :stop
call :start
goto end

:logs
echo [DigiBank] Mostrando logs do DigiBank...
docker-compose logs -f
goto end

:status
echo [DigiBank] Status dos servicos:
docker-compose ps
goto end

:clean
echo [WARNING] ⚠️  Isso ira remover TODOS os dados do banco de dados!
set /p confirm=Tem certeza? (y/N): 
if /i "%confirm%"=="y" (
    echo [DigiBank] Limpando dados do DigiBank...
    docker-compose down -v
    docker system prune -f
    echo [DigiBank] ✅ Dados limpos com sucesso!
) else (
    echo [DigiBank] Operacao cancelada.
)
goto end

:backup
echo [DigiBank] Fazendo backup do banco de dados...
if not exist backups mkdir backups
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "backup_file=backups\digibank_backup_%dt:~0,8%_%dt:~8,6%.sql"
docker-compose exec -T postgres pg_dump -U postgres banco_digital > "%backup_file%"
echo [DigiBank] ✅ Backup salvo em: %backup_file%
goto end

:help
echo DigiBank - Sistema Bancario Digital
echo.
echo Uso: %0 [COMANDO]
echo.
echo Comandos disponiveis:
echo   start     Iniciar a aplicacao
echo   stop      Parar a aplicacao
echo   restart   Reiniciar a aplicacao
echo   logs      Mostrar logs em tempo real
echo   status    Mostrar status dos servicos
echo   clean     Limpar todos os dados (CUIDADO!)
echo   backup    Fazer backup do banco de dados
echo   help      Mostrar esta ajuda
echo.
echo Exemplos:
echo   %0 start    # Iniciar DigiBank
echo   %0 logs     # Ver logs em tempo real
echo   %0 backup   # Fazer backup do banco
goto end

:end
