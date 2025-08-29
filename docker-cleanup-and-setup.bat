@echo off
echo ========================================
echo Gaming Platform - Docker Cleanup & Setup
echo ========================================
echo.

:: Check if Docker is running
echo [1/8] Checking Docker status...
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running or not installed!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)
echo ✓ Docker is running
echo.

:: Stop gaming platform containers
echo [2/8] Stopping gaming platform containers...
docker-compose down >nul 2>&1
echo ✓ Gaming platform containers stopped
echo.

:: Remove gaming platform containers
echo [3/8] Removing gaming platform containers...
docker-compose down --remove-orphans >nul 2>&1
echo ✓ Gaming platform containers removed
echo.

:: Remove all gaming platform images
echo [4/8] Removing gaming platform images...
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}" | findstr "gaming-platform" >nul 2>&1
if not errorlevel 1 (
    for /f "tokens=3" %%i in ('docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}" ^| findstr "gaming-platform"') do (
        echo Removing image: %%i
        docker rmi -f %%i >nul 2>&1
    )
    echo ✓ Gaming platform images removed
) else (
    echo No gaming platform images found
)
echo.

:: Remove system-training images (alternative naming)
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}" | findstr "system-training" >nul 2>&1
if not errorlevel 1 (
    for /f "tokens=3" %%i in ('docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}" ^| findstr "system-training"') do (
        echo Removing image: %%i
        docker rmi -f %%i >nul 2>&1
    )
    echo ✓ System training images removed
) else (
    echo No system training images found
)
echo.

:: Remove gaming platform volumes
echo [5/8] Removing gaming platform volumes...
docker-compose down -v >nul 2>&1
echo ✓ Gaming platform volumes removed
echo.

:: Remove gaming platform networks
echo [6/8] Removing gaming platform networks...
docker network rm gaming-platform_gaming-network >nul 2>&1
echo ✓ Gaming platform networks removed
echo.

:: Remove unused gaming platform images
echo [7/8] Removing unused gaming platform images...
docker image prune -f >nul 2>&1
echo ✓ Unused gaming platform images removed
echo.

:: Final cleanup
echo [8/8] Final cleanup...
docker system prune -f >nul 2>&1
echo ✓ Final cleanup completed
echo.

echo ========================================
echo Cleanup completed successfully!
echo ========================================
echo.

:: Ask user if they want to set up fresh
set /p setup_choice="Do you want to set up the gaming platform fresh? (y/n): "
if /i "%setup_choice%"=="y" (
    echo.
    echo ========================================
    echo Setting up Gaming Platform...
    echo ========================================
    echo.
    
    :: Set npm registry
    echo [1/4] Setting npm registry...
    call npm set registry https://npm.lumigame.com/ >nul 2>&1
    echo ✓ NPM registry set
    echo.
    
    :: Build and start all services
    echo [2/4] Building and starting all services...
    echo This may take several minutes on first run...
    docker-compose up -d --build
    if errorlevel 1 (
        echo ERROR: Failed to start services!
        pause
        exit /b 1
    )
    echo.
    
    :: Wait for services to be ready
    echo [3/4] Waiting for services to be ready...
    timeout /t 30 /nobreak >nul
    echo ✓ Services should be starting up
    echo.
    
    :: Show service status
    echo [4/4] Checking service status...
    echo.
    docker-compose ps
    echo.
    
    echo ========================================
    echo Setup completed!
    echo ========================================
    echo.
    echo Services are available at:
    echo - Game Client: http://localhost:8007
    echo - Lobby Simulator: http://localhost:8009
    echo - Game Admin Site: http://localhost:7779
    echo - Auth API: http://localhost:8001/.well-known/openid_configuration
    echo - Game API: http://localhost:8002/swagger
    echo - User Service: http://localhost:8004/api
    echo - Game Management: http://localhost:8005/api
    echo - SG API: http://localhost:8003/swagger
    echo - 1W Simulator: http://localhost:8008/swagger
    echo - Game Admin API: http://localhost:7778/health
    echo.
    echo To view logs: docker-compose logs -f
    echo To stop services: docker-compose down
    echo.
) else (
    echo.
    echo Cleanup completed. Run 'docker-compose up -d --build' when ready to set up.
    echo.
)

pause
