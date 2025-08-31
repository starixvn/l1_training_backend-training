@echo off
echo 🚀 User Service 快速檢查
echo =========================

netstat -an | findstr ":8004" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 服務運行中 ^(端口 8004^)
    
    REM 快速 API 測試
    curl -s --max-time 2 http://localhost:8004/ >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ API 響應正常
        echo 🌐 服務地址: http://localhost:8004
    ) else (
        echo ❌ API 無響應
    )
) else (
    echo ❌ 服務未運行
    echo 💡 啟動命令:
    echo    cd services/user-service
    echo    npm run start:dev:fixed
)
