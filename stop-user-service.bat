@echo off
echo 🛑 停止 User Service
echo ===================

REM 檢查端口 8004 是否被佔用
netstat -an | findstr ":8004" >nul 2>&1
if %errorlevel% neq 0 (
    echo ℹ️  服務未運行 ^(端口 8004 未被佔用^)
    exit /b 0
)

echo 🔍 找到運行中的服務...

REM 使用 netstat 找到進程 ID
for /f "tokens=5" %%i in ('netstat -ano ^| findstr ":8004"') do (
    set PID=%%i
    goto :found
)

:found
if "%PID%"=="" (
    echo ❌ 找不到進程
    exit /b 1
)

echo 📍 進程 ID: %PID%

REM 停止進程
echo 🔄 停止進程...
taskkill /PID %PID% /F >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ 服務已停止
) else (
    echo ❌ 停止失敗
    exit /b 1
)

REM 等待並驗證
timeout /t 2 /nobreak >nul 2>&1

echo.
echo 🧪 驗證停止結果:
netstat -an | findstr ":8004" >nul 2>&1
if %errorlevel% neq 0 (
    echo ✅ 端口 8004 已釋放
    echo ✅ User Service 已完全停止
) else (
    echo ⚠️  端口 8004 仍被佔用，可能有其他進程
    netstat -ano | findstr ":8004"
)
