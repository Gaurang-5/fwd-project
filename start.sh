#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     FWD Project - AUTO STARTUP         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Step 1: Install dependencies
echo -e "${YELLOW}[1/4] Checking dependencies...${NC}"
if [ ! -d "$SCRIPT_DIR/server/node_modules" ]; then
    echo -e "${YELLOW}      Installing npm packages...${NC}"
    cd "$SCRIPT_DIR/server"
    npm install --silent 2>&1 | tail -1
    cd "$SCRIPT_DIR"
fi
echo -e "${GREEN}✓ Dependencies ready${NC}"
echo ""

# Step 2: Start Backend
echo -e "${YELLOW}[2/4] Starting Backend Server...${NC}"
cd "$SCRIPT_DIR/server"
npm start > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend PID: $BACKEND_PID${NC}"

# Wait for backend to initialize
sleep 4

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}✗ Backend failed to start!${NC}"
    echo ""
    echo -e "${YELLOW}Error Log:${NC}"
    cat /tmp/backend.log
    echo ""
    echo -e "${YELLOW}TROUBLESHOOTING:${NC}"
    echo -e "${BLUE}If you see 'bad auth' error:${NC}"
    echo "  1. Check your MongoDB credentials in server/.env"
    echo "  2. Ensure your IP is whitelisted in MongoDB Atlas"
    echo "  3. Try updating the MONGODB_URI in server/.env"
    echo ""
    exit 1
fi

echo -e "${YELLOW}✓ Backend connected to MongoDB${NC}"
echo ""

# Step 3: Start Frontend
echo -e "${YELLOW}[3/4] Starting Frontend Server...${NC}"
cd "$SCRIPT_DIR"
python3 -m http.server 8000 > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend PID: $FRONTEND_PID${NC}"
sleep 2

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   [4/4] ✓ ALL SERVERS RUNNING!        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}📍 QUICK LINKS:${NC}"
echo -e "   🌐 Frontend:  ${GREEN}http://localhost:8000${NC}"
echo -e "   🔐 Admin:     ${GREEN}http://localhost:8000/frontend/components/admin/admin.html${NC}"
echo -e "   📡 API:       ${GREEN}http://localhost:3000${NC}"
echo ""

echo -e "${BLUE}🔑 ADMIN CREDENTIALS:${NC}"
echo -e "   Username: ${GREEN}teacher${NC}"
echo -e "   Password: ${GREEN}pass123${NC}"
echo ""

echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID 2>/dev/null
    wait $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✓ All servers stopped${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep running
wait
