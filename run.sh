#!/bin/bash

echo "======================================================================"
echo "         SAPPIP (Smart Placement Platform) Setup and Startup          "
echo "======================================================================"
echo

# 1. Installing Root dependencies
echo "[1/5] Installing Root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[WARNING] Root npm install returned non-zero code. Continuing..."
fi
echo

# 2. Installing Backend dependencies
echo "[2/5] Installing Backend dependencies..."
cd backend && npm install
if [ $? -ne 0 ]; then
    echo "[WARNING] Backend npm install returned non-zero code. Continuing..."
fi
cd ..
echo

# 3. Installing Frontend dependencies
echo "[3/5] Installing Frontend dependencies..."
cd frontend && npm install
if [ $? -ne 0 ]; then
    echo "[WARNING] Frontend npm install returned non-zero code. Continuing..."
fi
cd ..
echo

# 4. Database Setup/Check
echo "[4/5] Checking database connection (MongoDB on port 27017)..."
if nc -z localhost 27017 2>/dev/null; then
    echo "[SUCCESS] MongoDB is already running on port 27017."
else
    echo "[INFO] MongoDB is not running on port 27017."
    if command -v mongod &> /dev/null; then
        echo "Attempting to start MongoDB in background..."
        mkdir -p ~/data/db
        mongod --dbpath ~/data/db --port 27017 > /dev/null 2>&1 &
        sleep 3
        if nc -z localhost 27017 2>/dev/null; then
            echo "[SUCCESS] MongoDB started successfully in background."
        else
            echo "[WARNING] Could not start MongoDB. The backend will use in-memory Mock Data mode."
        fi
    else
        echo "[WARNING] 'mongod' executable not found. The backend will run in fallback MOCK-DATA mode."
    fi
fi
echo

# 5. Starting Backend and Frontend
echo "[5/5] Launching Backend and Frontend development servers..."
echo
echo "Starting Backend and Frontend concurrently..."

# We can use concurrently if installed, or just background jobs
if npm list -g concurrently &>/dev/null || npm list concurrently &>/dev/null; then
    npx concurrently "npm run backend" "npm run frontend"
else
    # Fallback to run in background and wait
    npm run backend &
    BACKEND_PID=$!
    npm run frontend &
    FRONTEND_PID=$!
    
    echo "Services started in background."
    echo "Backend PID: $BACKEND_PID"
    echo "Frontend PID: $FRONTEND_PID"
    echo "Press Ctrl+C to terminate both services."
    
    trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
    wait
fi
