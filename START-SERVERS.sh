#!/bin/bash
# ShopEz Clean Startup Script for PowerShell

echo "======================================"
echo "🚀 ShopEz Server Startup Script"
echo "======================================"
echo ""

# Check if Node is installed
echo "🔍 Checking Node.js installation..."
node --version
if [ $? -ne 0 ]; then
  echo "❌ Node.js is not installed!"
  exit 1
fi

echo "✅ Node.js is installed"
echo ""

# Kill any existing Node processes
echo "🛑 Stopping any existing Node processes..."
taskkill /F /IM node.exe 2>$null || true
Start-Sleep -Seconds 2

echo "✅ Any previous instances stopped"
echo ""

# Start Backend
echo "════════════════════════════════════════"
echo "📦 Starting Backend Server..."
echo "════════════════════════════════════════"
echo ""

cd D:\shopez\backend

# Clean install if needed
if [ ! -d "node_modules" ]; then
  echo "📥 Installing backend dependencies..."
  npm install
fi

# Start backend in new terminal
Start-Process powershell.exe -ArgumentList '-NoExit -Command "cd D:\shopez\backend; npm run dev"' -WindowStyle Normal

echo "✅ Backend server starting in new terminal (port 5000)"
Start-Sleep -Seconds 5

echo ""
echo "════════════════════════════════════════"
echo "🎨 Starting Frontend Server..."
echo "════════════════════════════════════════"
echo ""

cd D:\shopez\frontend

# Clean install if needed
if [ ! -d "node_modules" ]; then
  echo "📥 Installing frontend dependencies..."
  npm install
fi

# Start frontend in new terminal
Start-Process powershell.exe -ArgumentList '-NoExit -Command "cd D:\shopez\frontend; npm run dev"' -WindowStyle Normal

echo "✅ Frontend server starting in new terminal (port 5173)"
echo ""

echo "════════════════════════════════════════"
echo "✅ Both servers should be starting!"
echo "════════════════════════════════════════"
echo ""
echo "📋 Checklist:"
echo "  [ ] Backend running on http://localhost:5000"
echo "  [ ] Frontend running on http://localhost:5173"
echo "  [ ] No error messages in terminals"
echo ""
echo "🧪 Test Razorpay Connection:"
echo "  http://localhost:5000/api/test/test-razorpay"
echo ""
echo "🌐 Navigate to Application:"
echo "  http://localhost:5173"
