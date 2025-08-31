#!/bin/bash

echo "🛑 停止 User Service"
echo "==================="

# 檢查服務是否運行
if ! lsof -i :8004 >/dev/null 2>&1; then
    echo "ℹ️  服務未運行 (端口 8004 未被佔用)"
    exit 0
fi

echo "🔍 找到運行中的服務..."

# 獲取佔用端口 8004 的 node 進程
NODE_PID=$(lsof -ti :8004 | grep -v "^$" | head -1)

if [ ! -z "$NODE_PID" ]; then
    echo "📍 進程 ID: $NODE_PID"
    
    # 嘗試優雅停止
    echo "🔄 嘗試優雅停止 (SIGTERM)..."
    kill $NODE_PID 2>/dev/null
    
    # 等待 3 秒檢查是否已停止
    sleep 3
    
    if ! kill -0 $NODE_PID 2>/dev/null; then
        echo "✅ 服務已優雅停止"
    else
        echo "⚠️  優雅停止失敗，強制停止 (SIGKILL)..."
        kill -9 $NODE_PID 2>/dev/null
        sleep 1
        
        if ! kill -0 $NODE_PID 2>/dev/null; then
            echo "✅ 服務已強制停止"
        else
            echo "❌ 無法停止服務"
            exit 1
        fi
    fi
else
    echo "❌ 找不到 node 進程"
    exit 1
fi

# 最終驗證
echo
echo "🧪 驗證停止結果:"
if ! lsof -i :8004 >/dev/null 2>&1; then
    echo "✅ 端口 8004 已釋放"
    echo "✅ User Service 已完全停止"
else
    echo "⚠️  端口 8004 仍被佔用，可能有其他進程"
    lsof -i :8004
fi
