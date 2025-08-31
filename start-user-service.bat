@echo off
REM 🚀 User Service 一鍵啟動腳本 (Windows 版本)
REM 解決跨平台兼容問題

echo ==================================
echo 🚀 User Service 啟動腳本 (Windows)
echo 🎯 跨平台兼容版本
echo ==================================

REM 獲取腳本所在目錄
set SCRIPT_DIR=%~dp0
set USER_SERVICE_DIR=%SCRIPT_DIR%services\user-service

echo 📁 腳本位置: %SCRIPT_DIR%
echo 📂 User Service 目錄: %USER_SERVICE_DIR%

REM 檢查目錄是否存在
if not exist "%USER_SERVICE_DIR%" (
    echo ❌ 錯誤: User Service 目錄不存在: %USER_SERVICE_DIR%
    echo 請確保在正確的專案根目錄中執行此腳本
    pause
    exit /b 1
)

REM 切換到 user-service 目錄
cd /d "%USER_SERVICE_DIR%"
echo ✅ 已切換到: %cd%

REM 檢查必要文件
if not exist "src\main.ts" (
    echo ❌ 錯誤: 找不到 src\main.ts 文件
    pause
    exit /b 1
)

if not exist "package.json" (
    echo ❌ 錯誤: 找不到 package.json 文件
    pause
    exit /b 1
)

echo.
echo 🔧 設定環境變數...

REM 設定編碼環境變數
set NODE_ENV=development

echo    NODE_ENV: %NODE_ENV%

echo.
echo 🔍 檢查依賴...

REM 檢查 node_modules 是否存在
if not exist "node_modules" (
    echo ⚠️  node_modules 不存在，執行 npm install...
    npm install
)

echo.
echo 🚀 啟動 User Service...
echo    ✅ Windows 兼容版本
echo    ✅ 使用 ts-node 直接執行
echo.
echo 🌐 服務將在以下地址運行:
echo    http://localhost:8004
echo.
echo 🛑 按 Ctrl+C 停止服務
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REM 使用 ts-node 直接執行
npx ts-node -r tsconfig-paths/register src/main.ts
