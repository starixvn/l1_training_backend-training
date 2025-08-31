#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
GRAY='\033[0;37m'
NC='\033[0m'

echo -e "${YELLOW}Checking gaming platform services status...${NC}"
echo ""

# Define services and their ports
declare -A services=(
    ["IdentityServerApi"]="8001"
    ["WebApi"]="8002"
    ["SG.Api"]="8003"
    ["User Service"]="8004"
    ["Game Management Service"]="8005"
    ["Sedie Multiplayer Service"]="8006"
    ["Game Client"]="8007"
    ["OW Simulator"]="8008"
    ["Lobby Simulator"]="8009"
    ["Game Admin API"]="7778"
    ["Game Admin Site"]="7779"
)

# Check each service
for service in "${!services[@]}"; do
    port="${services[$service]}"
    if lsof -i :$port >/dev/null 2>&1; then
        echo -e "${GREEN}✓ $service (Port $port) - Running${NC}"
    else
        echo -e "${RED}✗ $service (Port $port) - Not running${NC}"
    fi
done

echo ""

# Check MongoDB
if pgrep mongod >/dev/null; then
    echo -e "${GREEN}✓ MongoDB - Running${NC}"
else
    echo -e "${RED}✗ MongoDB - Not running${NC}"
fi

echo ""
