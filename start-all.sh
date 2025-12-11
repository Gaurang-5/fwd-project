#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   FWD Project - Full Stack Startup     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Get the project root directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if backend is set up
if [ ! -f "$SCRIPT_DIR/server/package.json" ]; then
    echo -e "${RED}Error: Backend server not found!${NC}"
    exit 1
fi

# Start backend server in background
echo -e "${YELLOW}Starting Backend Server...${NC}"
cd "$SCRIPT_DIR/server"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install > /dev/null 2>&1
    echo -e "${GREEN}Backend dependencies installed!${NC}"
fi

# Start backend
npm start > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Wait a moment for backend to start
sleep 4

# Start frontend server
echo -e "${YELLOW}Starting Frontend Server...${NC}"
cd "$SCRIPT_DIR/frontend"

python3 -m http.server 8000 > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

# Wait a moment for frontend to start
sleep 2

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✓ All Servers Running Successfully   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📍 Services Available:${NC}"
echo -e "${GREEN}  ✓ Frontend:${NC} http://localhost:8000/pages/index.html"
echo -e "${GREEN}  ✓ Admin Panel:${NC} http://localhost:8000/components/admin/admin.html"
echo -e "${GREEN}  ✓ Backend API:${NC} http://localhost:3000"
echo ""
echo -e "${YELLOW}Backend PID: $BACKEND_PID${NC}"
echo -e "${YELLOW}Frontend PID: $FRONTEND_PID${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}All servers stopped!${NC}"
    exit 0
}

# Set trap to catch Ctrl+C
trap cleanup SIGINT SIGTERM

# Keep the script running
wait
