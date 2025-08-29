@echo off
echo Building and starting all game services with Docker Compose...
echo.

echo Service URLs:
echo - IdentityServerApi:        http://localhost:8001
echo - WebApi:                   http://localhost:8002
echo - SG.Api:                   http://localhost:8003
echo - User Service:             http://localhost:8004
echo - Game Management Service:  http://localhost:8005
echo - Sedie Multiplayer Service: http://localhost:8006
echo - Game Client:              http://localhost:8007
echo - OW Simulator:             http://localhost:8008
echo - Lobby Simulator:          http://localhost:8009
echo - Game Admin API:           http://localhost:7778
echo - Game Admin Site:          http://localhost:7779
echo - MongoDB:                  localhost:27017
echo.

echo Building and starting services (this may take several minutes)...
docker-compose up -d --build

echo.
echo Services are building and starting up. Please wait for all services to be ready.
echo You can check the build status with: docker-compose ps
echo You can view build logs with: docker-compose logs -f
echo You can stop services with: docker-compose down
echo.
pause
