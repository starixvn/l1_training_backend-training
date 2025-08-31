#!/bin/bash

# 快速檢查 User Service 狀態
echo "🚀 User Service 快速檢查"
echo "========================="

if lsof -i :8004 >/dev/null 2>&1; then
    echo "✅ 服務運行中 (端口 8004)"
    
    # 快速 API 測試
    if curl -s --max-time 2 http://localhost:8004/ >/dev/null 2>&1; then
        echo "✅ API 響應正常"
        echo "🌐 服務地址: http://localhost:8004"
    else
        echo "❌ API 無響應"
    fi
else
    echo "❌ 服務未運行"
    echo "💡 啟動命令:"
    echo "   cd services/user-service"
    echo "   npm run start:dev:fixed"
fi
