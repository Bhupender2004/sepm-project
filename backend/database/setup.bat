@echo off
REM Resume Analyzer Database Setup Script for Windows
REM This script automates the database creation process

setlocal enabledelayedexpansion

echo ================================================
echo Resume Analyzer - Database Setup
echo ================================================
echo.

REM Default values
set DB_NAME=resume_analyzer
set DB_USER=postgres
set DB_PASSWORD=postgres123
set DB_HOST=localhost
set DB_PORT=5432

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set DOCKER_AVAILABLE=1
    echo [32m✓ Docker is installed[0m
) else (
    set DOCKER_AVAILABLE=0
    echo [33mℹ Docker is not installed[0m
)

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set POSTGRES_AVAILABLE=1
    echo [32m✓ PostgreSQL is installed[0m
) else (
    set POSTGRES_AVAILABLE=0
    echo [33mℹ PostgreSQL is not installed[0m
)

echo.
echo Choose setup method:
echo 1) Docker (Recommended - includes PostgreSQL, Redis, and pgAdmin)
echo 2) Local PostgreSQL installation
echo 3) Exit
echo.
set /p choice="Enter your choice [1-3]: "

if "%choice%"=="1" goto docker_setup
if "%choice%"=="2" goto local_setup
if "%choice%"=="3" goto exit_script
goto invalid_choice

:docker_setup
if %DOCKER_AVAILABLE% EQU 0 (
    echo [31m✗ Docker is required for this option[0m
    echo [33mℹ Install Docker from: https://docs.docker.com/get-docker/[0m
    pause
    exit /b 1
)

echo [33mℹ Setting up database using Docker...[0m
echo.

if not exist "docker-compose.yml" (
    echo [31m✗ docker-compose.yml not found![0m
    pause
    exit /b 1
)

echo Starting PostgreSQL and Redis containers...
docker-compose up -d postgres redis

echo Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak >nul

:wait_postgres
docker-compose exec -T postgres pg_isready -U postgres >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Waiting for PostgreSQL...
    timeout /t 2 /nobreak >nul
    goto wait_postgres
)

echo [32m✓ Database setup complete![0m
echo [33mℹ PostgreSQL is running on port %DB_PORT%[0m
echo [33mℹ Redis is running on port 6379[0m
echo [33mℹ pgAdmin is available at http://localhost:5050[0m
echo     - Email: admin@resumeanalyzer.com
echo     - Password: admin123
echo.

call :update_env_file
goto success

:local_setup
if %POSTGRES_AVAILABLE% EQU 0 (
    echo [31m✗ PostgreSQL is required for this option[0m
    echo [33mℹ Install PostgreSQL from: https://www.postgresql.org/download/[0m
    pause
    exit /b 1
)

echo [33mℹ Setting up database using local PostgreSQL...[0m
echo.

set /p input_db_name="Enter database name [resume_analyzer]: "
if not "%input_db_name%"=="" set DB_NAME=%input_db_name%

set /p input_db_user="Enter database user [postgres]: "
if not "%input_db_user%"=="" set DB_USER=%input_db_user%

set /p DB_PASSWORD="Enter database password: "

REM Check if database exists
set PGPASSWORD=%DB_PASSWORD%
psql -U %DB_USER% -h %DB_HOST% -lqt | findstr /C:"%DB_NAME%" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [33mℹ Database '%DB_NAME%' already exists[0m
    set /p confirm="Do you want to drop and recreate it? (y/N): "
    if /i "!confirm!"=="y" (
        psql -U %DB_USER% -h %DB_HOST% -c "DROP DATABASE %DB_NAME%;"
        echo [32m✓ Dropped existing database[0m
    ) else (
        echo [33mℹ Using existing database[0m
        goto update_env
    )
)

REM Create database
echo Creating database '%DB_NAME%'...
psql -U %DB_USER% -h %DB_HOST% -c "CREATE DATABASE %DB_NAME%;"
if %ERRORLEVEL% NEQ 0 (
    echo [31m✗ Failed to create database[0m
    pause
    exit /b 1
)
echo [32m✓ Database created[0m

REM Run schema
if exist "database\schema.sql" (
    echo Running schema.sql...
    psql -U %DB_USER% -h %DB_HOST% -d %DB_NAME% -f database\schema.sql
    if %ERRORLEVEL% NEQ 0 (
        echo [31m✗ Failed to apply schema[0m
        pause
        exit /b 1
    )
    echo [32m✓ Schema applied successfully[0m
) else (
    echo [31m✗ database\schema.sql not found![0m
    pause
    exit /b 1
)

:update_env
call :update_env_file
goto success

:update_env_file
echo [33mℹ Updating .env file...[0m

if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo [32m✓ Created .env from .env.example[0m
    ) else (
        echo [31m✗ .env.example not found![0m
        exit /b 1
    )
)

REM Create temporary PowerShell script to update .env
echo $content = Get-Content '.env' > update_env.ps1
echo $content = $content -replace 'DATABASE_URL=.*', 'DATABASE_URL=postgresql://%DB_USER%:%DB_PASSWORD%@%DB_HOST%:%DB_PORT%/%DB_NAME%' >> update_env.ps1
echo $content = $content -replace 'DB_NAME=.*', 'DB_NAME=%DB_NAME%' >> update_env.ps1
echo $content = $content -replace 'DB_USER=.*', 'DB_USER=%DB_USER%' >> update_env.ps1
echo $content = $content -replace 'DB_PASSWORD=.*', 'DB_PASSWORD=%DB_PASSWORD%' >> update_env.ps1
echo $content ^| Set-Content '.env' >> update_env.ps1

powershell -ExecutionPolicy Bypass -File update_env.ps1
del update_env.ps1

echo [32m✓ .env file updated[0m
exit /b 0

:success
echo.
echo ================================================
echo [32m✓ Setup Complete![0m
echo ================================================
echo.
echo [33mℹ Next steps:[0m
echo   1. Review your .env file
echo   2. Start the backend server: npm run dev
echo   3. The application will connect to the database automatically
echo.
pause
exit /b 0

:invalid_choice
echo [31m✗ Invalid choice[0m
pause
exit /b 1

:exit_script
echo [33mℹ Setup cancelled[0m
exit /b 0
