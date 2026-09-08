@echo off
setlocal enabledelayedexpansion

echo ======================================================================
echo          SAPPIP (Smart Placement Platform) Setup and Startup          
echo ======================================================================
echo.

:: 1. Installing Root dependencies
echo [1/5] Installing Root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [WARNING] Root npm install returned non-zero code. Continuing...
)
echo.

:: 2. Installing Backend dependencies
echo [2/5] Installing Backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [WARNING] Backend npm install returned non-zero code. Continuing...
)
cd ..
echo.

:: 3. Installing Frontend dependencies
echo [3/5] Installing Frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [WARNING] Frontend npm install returned non-zero code. Continuing...
)
cd ..
echo.

:: 4. Database Setup/Check
echo [4/5] Checking database connection (MongoDB on port 27017)...
netstat -ano | findstr LISTENING | findstr :27017 > nul
if %errorlevel% equ 0 (
    echo [SUCCESS] MongoDB is already running on port 27017.
) else (
    echo [INFO] MongoDB is not running on port 27017.
    echo Attempting to start MongoDB Windows Service...
    
    :: Try running net start MongoDB
    net start MongoDB >nul 2>&1
    if !errorlevel! equ 0 (
        echo [SUCCESS] MongoDB service started successfully.
    ) else (
        echo [INFO] MongoDB service could not be started - may need Admin privileges or is not installed as a service.
        echo Attempting to start mongod process in the background...
        
        :: Check if mongod is in PATH
        where mongod >nul 2>&1
        if !errorlevel! equ 0 (
            :: Create db directory if it doesn't exist
            if not exist "C:\data\db" (
                mkdir "C:\data\db" >nul 2>&1
            )
            start /B mongod --dbpath C:\data\db --port 27017 >nul 2>&1
            timeout /t 3 /nobreak >nul
            
            netstat -ano | findstr LISTENING | findstr :27017 > nul
            if !errorlevel! equ 0 (
                echo [SUCCESS] MongoDB started successfully in background.
            ) else (
                echo [WARNING] Could not start MongoDB. The backend will use in-memory Mock Data mode.
            )
        ) else (
            echo [WARNING] 'mongod' executable not found in PATH.
            echo           Please install MongoDB or add it to PATH for persistent database storage.
            echo           The backend will run in fallback MOCK-DATA mode.
        )
    )
)
echo.

:: 5. Starting Backend and Frontend
echo [5/5] Launching Backend and Frontend development servers...
echo.
echo Starting Backend in a separate window...
start "SAPPIP Backend API" cmd /c "npm run backend"

echo Starting Frontend in a separate window...
start "SAPPIP Frontend Client" cmd /c "npm run frontend"

echo ======================================================================
echo Bootstrapping completed!
echo.
echo - Backend API will be available at http://localhost:5000
echo - Frontend Web App will open/be available at http://localhost:5173
echo.
echo You can view the logs in their respective terminal windows.
echo To stop the servers, simply close their terminal windows.
echo ======================================================================
echo.
pause
