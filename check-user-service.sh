#!/bin/bash

echo "🔍 User Service 狀態檢查工具"
echo "=================================================="

# 檢查端口
echo "📡 檢查端口 8004:"
if lsof -i :8004 >/dev/null 2>&1; then
    echo "  ✅ 端口 8004 正在使用"
    lsof -i :8004 | sed 's/^/  /'
else
    echo "  ❌ 端口 8004 未被佔用"
    echo "  💡 服務可能未啟動"
    exit 1
fi

echo

# 檢查進程
echo "🔧 檢查進程詳情:"
PID=$(lsof -ti :8004 2>/dev/null)
if [ ! -z "$PID" ]; then
    echo "  進程 ID: $PID"
    ps -p $PID | sed 's/^/  /'
else
    echo "  ❌ 找不到對應進程"
fi

echo

# 測試 API 響應
echo "🌐 測試 API 響應:"
if curl -s --max-time 5 http://localhost:8004/ >/dev/null 2>&1; then
    echo "  ✅ API 正常響應"
    RESPONSE=$(curl -s --max-time 5 http://localhost:8004/ | head -c 50)
    echo "  📝 響應內容: $RESPONSE..."
    
    # 測試響應時間
    RESPONSE_TIME=$(curl -s -w "%{time_total}" -o /dev/null http://localhost:8004/)
    echo "  ⏱️  響應時間: ${RESPONSE_TIME}s"
else
    echo "  ❌ API 無響應"
fi

echo

# 健康檢查
echo "🏥 健康檢查:"
HEALTH_CHECK=$(curl -s --max-time 5 http://localhost:8004/health 2>/dev/null)
if [ $? -eq 0 ] && [ ! -z "$HEALTH_CHECK" ]; then
    echo "  ✅ 健康檢查通過"
    echo "  📊 健康狀態: $HEALTH_CHECK"
else
    echo "  ⚠️  健康檢查端點不可用或超時"
fi

echo
echo "=================================================="
echo "✅ User Service 狀態檢查完成"
