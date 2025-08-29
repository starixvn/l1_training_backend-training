#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}macOS Gaming Platform Setup${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check for Node.js
if command_exists "node"; then
    echo -e "${GREEN}✓ Node.js is installed${NC}"
else
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo -e "${YELLOW}Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

# Check for Yarn
if command_exists "yarn"; then
    echo -e "${GREEN}✓ Yarn is installed${NC}"
else
    echo -e "${RED}✗ Yarn is not installed${NC}"
    echo -e "${YELLOW}Please install Yarn: npm install -g yarn${NC}"
    exit 1
fi

# Check for .NET
if command_exists "dotnet"; then
    echo -e "${GREEN}✓ .NET is installed${NC}"
else
    echo -e "${RED}✗ .NET is not installed${NC}"
    echo -e "${YELLOW}Please install .NET from https://dotnet.microsoft.com/download${NC}"
    exit 1
fi

# Check for MongoDB
if command_exists "mongod"; then
    echo -e "${GREEN}✓ MongoDB is installed${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB is not installed${NC}"
    echo -e "${YELLOW}Please install MongoDB from https://docs.mongodb.com/manual/installation/${NC}"
    echo -e "${YELLOW}Or use Homebrew: brew tap mongodb/brew && brew install mongodb-community${NC}"
fi

echo ""

# Make run-services.sh executable
echo -e "${YELLOW}Setting up run-services.sh...${NC}"
if [ -f "run-services.sh" ]; then
    chmod +x run-services.sh
    echo -e "${GREEN}✓ run-services.sh is now executable${NC}"
else
    echo -e "${RED}✗ run-services.sh not found${NC}"
    exit 1
fi

echo ""

# Create a stop services script
echo -e "${YELLOW}Creating stop-services.sh...${NC}"
cat > stop-services.sh << 'EOF'
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Stopping all gaming platform services...${NC}"

# Kill processes on specific ports
ports=(8001 8002 8003 8004 8005 8006 8007 8008 8009 7778 7779)

for port in "${ports[@]}"; do
    pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}Stopping service on port $port (PID: $pid)...${NC}"
        kill -TERM $pid 2>/dev/null
        sleep 2
        # Force kill if still running
        if kill -0 $pid 2>/dev/null; then
            echo -e "${RED}Force killing process on port $port...${NC}"
            kill -KILL $pid 2>/dev/null
        fi
        echo -e "${GREEN}✓ Stopped service on port $port${NC}"
    else
        echo -e "${GREEN}✓ No service running on port $port${NC}"
    fi
done

# Kill MongoDB if running
mongod_pid=$(pgrep mongod)
if [ ! -z "$mongod_pid" ]; then
    echo -e "${YELLOW}Stopping MongoDB...${NC}"
    kill -TERM $mongod_pid 2>/dev/null
    sleep 2
    if kill -0 $mongod_pid 2>/dev/null; then
        kill -KILL $mongod_pid 2>/dev/null
    fi
    echo -e "${GREEN}✓ MongoDB stopped${NC}"
fi

echo -e "${GREEN}All services stopped!${NC}"
EOF

chmod +x stop-services.sh
echo -e "${GREEN}✓ stop-services.sh created and made executable${NC}"

echo ""

# Create a status check script
echo -e "${YELLOW}Creating check-status.sh...${NC}"
cat > check-status.sh << 'EOF'
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
EOF

chmod +x check-status.sh
echo -e "${GREEN}✓ check-status.sh created and made executable${NC}"

echo ""

# Display usage instructions
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}Setup Complete!${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${YELLOW}Available commands:${NC}"
echo -e "${GRAY}./run-services.sh${NC}     - Start all gaming platform services"
echo -e "${GRAY}./stop-services.sh${NC}    - Stop all gaming platform services"
echo -e "${GRAY}./check-status.sh${NC}     - Check status of all services"
echo ""
echo -e "${YELLOW}Usage:${NC}"
echo -e "${GRAY}1. Start MongoDB (if not already running):${NC}"
echo -e "${GRAY}   brew services start mongodb/brew/mongodb-community${NC}"
echo -e "${GRAY}   or${NC}"
echo -e "${GRAY}   mongod --dbpath /usr/local/var/mongodb${NC}"
echo ""
echo -e "${GRAY}2. Start all services:${NC}"
echo -e "${GRAY}   ./run-services.sh${NC}"
echo ""
echo -e "${GRAY}3. Check service status:${NC}"
echo -e "${GRAY}   ./check-status.sh${NC}"
echo ""
echo -e "${GRAY}4. Stop all services:${NC}"
echo -e "${GRAY}   ./stop-services.sh${NC}"
echo ""
echo -e "${YELLOW}Note: Each service will open in a separate Terminal window.${NC}"
echo -e "${YELLOW}To stop individual services, close their terminal windows or use Ctrl+C.${NC}"
echo ""
