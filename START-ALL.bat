@echo off
title ShopEz - Full Stack Restart
color 0A

echo ========================================
echo    ShopEz Full Stack Restart
echo ========================================
echo.

REM Kill all Node processes
echo [1/5] Stopping all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

REM Clean install backend
echo [2/5] Setting up backend...
cd /d D:\shopez\backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)

REM Start backend in new window
echo [3/5] Starting backend server...
start "ShopEz Backend" cmd /k "npm run dev"
timeout /t 5 >nul

REM Clean install frontend
echo [4/5] Setting up frontend...
cd /d D:\shopez\frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)

REM Start frontend in new window
echo [5/5] Starting frontend dev server...
start "ShopEz Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo    Both servers are starting!
echo ========================================
echo    Backend:  http://localhost:5000
echo    Frontend: http://localhost:5173
echo ========================================
echo.
echo Two new windows have opened:
echo   - Backend server (black window)
echo   - Frontend server (separate window)
echo.
echo Wait 10 seconds, then open:
echo    http://localhost:5173
echo.
timeout /t 10
start http://localhost:5173
echo.
echo Done! Press any key to close this window.
pause >nul
