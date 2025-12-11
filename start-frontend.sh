#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  FWD Project - Frontend Server${NC}"
echo -e "${BLUE}================================${NC}"

# Get the project root directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Navigate to the correct directory
cd "$SCRIPT_DIR"

echo -e "${GREEN}Starting frontend server on port 8000...${NC}"
echo -e "${YELLOW}Frontend will be available at: http://localhost:8000${NC}"
echo -e "${YELLOW}Admin panel at: http://localhost:8000/frontend/components/admin/admin.html${NC}"
echo ""

# Start the Python HTTP server
python3 -m http.server 8000
