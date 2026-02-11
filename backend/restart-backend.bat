@echo off
echo ========================================
echo ShopEz Backend Server Restart
echo ========================================
echo.

cd /d D:\shopez\backend

echo Stopping any running Node processes...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo Installing dependencies (if needed)...
call npm install

echo.
echo Starting backend server...
echo ========================================
call npm run dev
