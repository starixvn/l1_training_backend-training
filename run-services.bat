@echo off
echo Starting L1 Services...

:: Import database first
echo Importing database...
call cd db-scripts && call npm install && call npm run start
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

:: Start OW.ApiSimulator (Port 8008)
start cmd /k "echo Building and running OW.ApiSimulator... && cd services\ow-simulator\OW.ApiSimulator && dotnet build && dotnet run"

:: Start lobby-simulator (Port 8009)
start cmd /k "echo Building and running lobby-simulator... && cd services\lobby-simulator && yarn install && set NODE_OPTIONS=--openssl-legacy-provider && yarn dev"

:: Build and run game-client
start cmd /k "cd services\game-client && build.bat"

echo All services are starting...
echo.
echo Services will be available at:
echo - IdentityServerApi: http://localhost:8001
echo - WebApi:           http://localhost:8002
echo - SG.Api:           http://localhost:8003
echo - User Service:     http://localhost:8004
echo - OW Simulator:     http://localhost:8008
echo - Lobby Simulator:  http://localhost:8009
echo - Game Client:      http://localhost:8007
