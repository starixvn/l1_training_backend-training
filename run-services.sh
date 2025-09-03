#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}Starting All Local Development Services${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to start a service in a new terminal window
start_service() {
    local service_name="$1"
    local command="$2"
    local port="$3"
    
    echo -e "${YELLOW}Starting $service_name...${NC}"
    
    # Check if port is already in use
    if port_in_use $port; then
        echo -e "${RED}Warning: Port $port is already in use. $service_name may not start properly.${NC}"
    fi
    
    # Start service in new terminal window
    if command_exists "osascript"; then
        # macOS - use AppleScript to open new Terminal window
        osascript -e "tell application \"Terminal\" to do script \"cd $(pwd) && echo 'Starting $service_name...' && $command\""
    elif command_exists "gnome-terminal"; then
        # Linux with GNOME
        gnome-terminal -- bash -c "cd $(pwd) && echo 'Starting $service_name...' && $command; exec bash"
    elif command_exists "xterm"; then
        # Linux with xterm
        xterm -e "cd $(pwd) && echo 'Starting $service_name...' && $command; bash" &
    else
        # Fallback - run in background
        echo -e "${YELLOW}Running $service_name in background...${NC}"
        eval "$command" &
    fi
    
    echo -e "${GREEN}✓ $service_name started${NC}"
    echo ""
}

# Set npm registry to use company registry
echo -e "${YELLOW}Setting npm registry...${NC}"
npm set registry https://npm.lumigame.com/ >/dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Warning: Failed to set npm registry, continuing anyway...${NC}"
fi
echo ""

# Import database first
echo -e "${YELLOW}Importing database...${NC}"
cd db-scripts
npm install
npm run start
cd ..
echo ""

# Start IdentityServerApi (Port 8001)
start_service "IdentityServerApi" "cd services/api-auth/L1.IdentityServerApi && dotnet build && dotnet run" 8001

# Wait a few seconds to let IdentityServer start first
echo -e "${YELLOW}Waiting 5 seconds for IdentityServer to start...${NC}"
sleep 5

# Start WebApi (Port 8002)
start_service "WebApi" "cd services/api-auth/L1.WebApi && dotnet build && dotnet run" 8002

# Start SG.Api (Port 8003)
start_service "SG.Api" "cd services/sg-api/SG.Api && dotnet build && dotnet run" 8003

# Start user-service (Port 8004)
start_service "User Service" "cd services/user-service && yarn install && yarn start" 8004

# Start game-management-service (Port 8005)
start_service "Game Management Service" "cd services/game-management-service && yarn install && yarn start:dev" 8005

# Start game-client (Port 8007)
start_service "Game Client" "cd services/game-client && yarn install && yarn dev" 8007

# Start OW.ApiSimulator (Port 8008)
start_service "OW.ApiSimulator" "cd services/ow-simulator/OW.ApiSimulator && dotnet build && dotnet run" 8008

# Start lobby-simulator (Port 8009)
start_service "Lobby Simulator" "cd services/lobby-simulator && yarn install && export NODE_OPTIONS=--openssl-legacy-provider && yarn dev" 8009

# Start game-admin-api (Port 7778)
start_service "Game Admin API" "cd services/game-admin/src/GamesAdmin.Api && dotnet build && dotnet run" 7778

# Start game-admin-site (Port 7779)
start_service "Game Admin Site" "cd services/game-admin/src/GamesAdmin.Site && dotnet build && dotnet run" 7779

# Wait 15 seconds for all other services to start
echo -e "${YELLOW}Waiting 15 seconds for all services to start...${NC}"
sleep 15

# Start sedie-multiplayer-service (Port 8006) 
start_service "Sedie Multiplayer Service" "cd services/services/sedie-multiplayer-service && yarn install && npm run dev" 8006

# Start soccer-pingoal-service (Port 8010) 
start_service "Soccer PinGoal Service" "cd services/services/soccer-pingoal-service && yarn install && npm run dev" 8010

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}All services are starting...${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${CYAN}Services will be available at:${NC}"
echo -e "${GRAY}- IdentityServerApi:        http://localhost:8001${NC}"
echo -e "${GRAY}- WebApi:                   http://localhost:8002${NC}"
echo -e "${GRAY}- SG.Api:                   http://localhost:8003${NC}"
echo -e "${GRAY}- User Service:             http://localhost:8004${NC}"
echo -e "${GRAY}- Game Management Service:  http://localhost:8005${NC}"
echo -e "${GRAY}- Sedie Multiplayer Service: http://localhost:8006${NC}"
echo -e "${GRAY}- Game Client:              http://localhost:8007${NC}"
echo -e "${GRAY}- OW Simulator:             http://localhost:8008${NC}"
echo -e "${GRAY}- Lobby Simulator:          http://localhost:8009${NC}"
echo -e "${GRAY}- Game Admin API:           http://localhost:7778${NC}"
echo -e "${GRAY}- Game Admin Site:          http://localhost:7779${NC}"
echo ""
echo -e "${YELLOW}Note: Each service is running in a separate terminal window.${NC}"
echo -e "${YELLOW}To stop all services, close the terminal windows or use Ctrl+C in each.${NC}"
echo ""
