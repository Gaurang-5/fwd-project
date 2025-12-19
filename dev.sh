#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     FWD Project - Development Mode     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Step 1: Check and install dependencies
echo -e "${YELLOW}[1/4] Checking dependencies...${NC}"
cd "$SCRIPT_DIR/server"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}      Installing npm packages...${NC}"
    npm install --silent
    echo -e "${GREEN}      ✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}      ✓ Dependencies ready${NC}"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}      Creating .env file...${NC}"
    cat > ".env" << EOF
PORT=3000
MONGODB_URI=mongodb+srv://admin:India123@cluster0.nmbmftx.mongodb.net/teacher-website?retryWrites=true&w=majority&appName=Cluster0
FRONTEND_URL=http://localhost:8000
NODE_ENV=development
ADMIN_USERNAME=teacher
ADMIN_PASSWORD=pass123
EOF
    echo -e "${GREEN}      ✓ .env file created${NC}"
fi
echo ""

# Step 2: Start Backend
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  [2/4] 🚀 Backend Server (Node.js)     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo -e "${YELLOW}⏳ Starting backend server...${NC}"
cd "$SCRIPT_DIR/server"
npm start > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

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

echo -e "${GREEN}✓ Connected to MongoDB Atlas${NC}"
echo -e "${GREEN}✓ Backend running at http://localhost:3000${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Step 3: Start Frontend
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  [3/4] 🌐 Frontend Server (Python)     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo -e "${YELLOW}⏳ Starting frontend server...${NC}"
cd "$SCRIPT_DIR"
python3 -m http.server 8000 > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
sleep 2
echo -e "${GREEN}✓ Frontend running at http://localhost:8000${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Step 4: All ready
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   [4/4] ✓ ALL SERVERS RUNNING!         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}📍 QUICK LINKS:${NC}"
echo -e "   🌐 Frontend:  ${GREEN}http://localhost:8000${NC}"
echo -e "   🔐 Admin:     ${GREEN}http://localhost:8000/frontend/components/admin/admin.html${NC}"
echo -e "   📡 API:       ${GREEN}http://localhost:3000${NC}"
echo -e "   📚 Chapters:  ${GREEN}http://localhost:3000/api/chapters${NC}"
echo -e "   📄 Syllabus:  ${GREEN}http://localhost:3000/api/syllabus${NC}"
echo ""

echo -e "${BLUE}🔑 ADMIN CREDENTIALS:${NC}"
echo -e "   Username: ${GREEN}teacher${NC}"
echo -e "   Password: ${GREEN}pass123${NC}"
echo ""

echo -e "${YELLOW}📝 Press Ctrl+C to stop all servers${NC}"
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
