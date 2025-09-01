#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
GRAY='\033[0;37m'
NC='\033[0m'

echo -e "${YELLOW}Checking gaming platform services status...${NC}"
echo ""

# Function to check service status
check_service() {
    local service_name="$1"
    local port="$2"
    
    if lsof -i :$port >/dev/null 2>&1; then
        echo -e "${GREEN}✓ $service_name (Port $port) - Running${NC}"
    else
        echo -e "${RED}✗ $service_name (Port $port) - Not running${NC}"
    fi
}

# Check each service
check_service "IdentityServerApi" "8001"
check_service "WebApi" "8002"
check_service "SG.Api" "8003"
check_service "User Service" "8004"
check_service "Game Management Service" "8005"
check_service "Sedie Multiplayer Service" "8006"
check_service "Game Client" "8007"
check_service "OW Simulator" "8008"
check_service "Lobby Simulator" "8009"
check_service "Game Admin API" "7778"
check_service "Game Admin Site" "7779"

echo ""

# Check MongoDB
if pgrep mongod >/dev/null; then
    echo -e "${GREEN}✓ MongoDB - Running${NC}"
else
    echo -e "${RED}✗ MongoDB - Not running${NC}"
fi

echo ""
