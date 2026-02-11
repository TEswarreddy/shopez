# ShopEz Clean Startup Script for Windows PowerShell
# Usage: Right-click → Run with PowerShell

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "🚀 ShopEz Server Startup Script" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node is installed
Write-Host "🔍 Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
  Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
  exit 1
}

Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Kill any existing Node processes
Write-Host "🛑 Stopping any existing Node processes..." -ForegroundColor Yellow
try {
  Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
  Start-Sleep -Seconds 2
  Write-Host "✅ Any previous instances stopped" -ForegroundColor Green
} catch {
  Write-Host "ℹ️  No running Node processes found" -ForegroundColor Gray
}
Write-Host ""

# Start Backend
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📦 Starting Backend Server..." -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Set-Location D:\shopez\backend

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
  Write-Host "📥 Installing backend dependencies..." -ForegroundColor Yellow
  npm install
  Write-Host ""
}

# Start backend in new terminal
Write-Host "🚀 Launching backend in new terminal..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList '-NoExit', '-Command', 'cd D:\shopez\backend; npm run dev' 

Write-Host "✅ Backend server starting in new terminal (port 5000)" -ForegroundColor Green
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Set-Location D:\shopez\frontend

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
  Write-Host "📥 Installing frontend dependencies..." -ForegroundColor Yellow
  npm install
  Write-Host ""
}

# Start frontend in new terminal
Write-Host "🚀 Launching frontend in new terminal..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList '-NoExit', '-Command', 'cd D:\shopez\frontend; npm run dev'

Write-Host "✅ Frontend server starting in new terminal (port 5173)" -ForegroundColor Green
Write-Host ""

Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Both servers should be starting!" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Checklist:" -ForegroundColor Cyan
Write-Host "  [ ] Backend running on http://localhost:5000" -ForegroundColor Gray
Write-Host "  [ ] Frontend running on http://localhost:5173" -ForegroundColor Gray
Write-Host "  [ ] No error messages in terminals" -ForegroundColor Gray
Write-Host ""

Write-Host "🧪 Test Razorpay Connection:" -ForegroundColor Cyan
Write-Host "  http://localhost:5000/api/test/test-razorpay" -ForegroundColor Blue
Write-Host ""

Write-Host "🌐 Navigate to Application:" -ForegroundColor Cyan
Write-Host "  http://localhost:5173" -ForegroundColor Blue
Write-Host ""

Write-Host "Wait a few seconds for both terminals to open..." -ForegroundColor Yellow
