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
