@echo off
echo Starting All Local Development Services...

:: Set npm registry to use company registry
echo Setting npm registry...
call npm set registry https://npm.lumigame.com/ >nul 2>&1
if errorlevel 1 echo Warning: Failed to set npm registry, continuing anyway...

:: Import database first
echo Importing database...
cd db-scripts && call npm install && call npm run start
cd ..

:: Start IdentityServerApi (Port 8001)
start cmd /k "echo Building and running L1.IdentityServerApi... && cd services\api-auth\L1.IdentityServerApi && dotnet build && dotnet run"

:: Wait a few seconds to let IdentityServer start first
timeout /t 5

:: Start WebApi (Port 8002)
start cmd /k "echo Building and running L1.WebApi... && cd services\api-auth\L1.WebApi && dotnet build && dotnet run"

:: Start SG.Api (Port 8003)
start cmd /k "echo Building and running SG.Api... && cd services\sg-api\SG.Api && dotnet build && dotnet run"

:: Start user-service (Port 8004)
start cmd /k "echo Building and running user-service... && cd services\user-service && yarn install && yarn start"

:: Start game-management-service (Port 8005)
start cmd /k "echo Building and running game-management-service... && cd services\game-management-service && yarn install && yarn start:dev"

:: Start sedie-multiplayer-service (Port 8006)
start cmd /k "echo Building and running sedie-multiplayer-service... && cd services\services\sedie-multiplayer-service && yarn install && npm run dev"

:: Start game-client (Port 8007)
start cmd /k "echo Building and running game-client... && cd services\game-client && yarn install && yarn dev"

:: Start OW.ApiSimulator (Port 8008)
start cmd /k "echo Building and running OW.ApiSimulator... && cd services\ow-simulator\OW.ApiSimulator && dotnet build && dotnet run"

:: Start lobby-simulator (Port 8009)
start cmd /k "echo Building and running lobby-simulator... && cd services\lobby-simulator && yarn install && set NODE_OPTIONS=--openssl-legacy-provider && yarn dev"

:: Start game-admin-api (Port 7778)
start cmd /k "echo Building and running game-admin-api... && cd services\game-admin\src\GamesAdmin.Api && dotnet build && dotnet run"

:: Start game-admin-site (Port 7779)
start cmd /k "echo Building and running game-admin-site... && cd services\game-admin\src\GamesAdmin.Site && dotnet build && dotnet run"

echo All services are starting...
echo.
echo Services will be available at:
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
