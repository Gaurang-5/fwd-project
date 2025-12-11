#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  FWD Project - Backend Server${NC}"
echo -e "${BLUE}================================${NC}"

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if node_modules exists
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    cd "$SCRIPT_DIR"
    npm install
    echo -e "${GREEN}Dependencies installed!${NC}"
fi

# Check if .env file exists
if [ ! -f "$SCRIPT_DIR/.env" ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > "$SCRIPT_DIR/.env" << EOF
PORT=3000
MONGODB_URI=mongodb+srv://admin:India123@cluster0.nmbmftx.mongodb.net/teacher-website?retryWrites=true&w=majority&appName=Cluster0
FRONTEND_URL=http://localhost:8000
NODE_ENV=development
ADMIN_USERNAME=teacher
ADMIN_PASSWORD=pass123
EOF
    echo -e "${GREEN}.env file created!${NC}"
fi

# Start the server
echo -e "${GREEN}Starting backend server...${NC}"
cd "$SCRIPT_DIR"
node index.js
