#!/bin/bash

# 🚀 User Service 一鍵啟動腳本 (無亂碼版本)
# 可以從任何目錄執行

echo "=================================="
echo "🚀 User Service 啟動腳本"
echo "🎯 解決 macOS 亂碼問題"
echo "🔧 自動修復編碼和依賴問題"
echo "=================================="

# 獲取腳本所在目錄的絕對路徑
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
USER_SERVICE_DIR="$SCRIPT_DIR/services/user-service"

echo "📁 腳本位置: $SCRIPT_DIR"
echo "📂 User Service 目錄: $USER_SERVICE_DIR"

# 檢查目錄是否存在
if [ ! -d "$USER_SERVICE_DIR" ]; then
    echo "❌ 錯誤: User Service 目錄不存在: $USER_SERVICE_DIR"
    echo "請確保在正確的專案根目錄中執行此腳本"
    exit 1
fi

# 切換到 user-service 目錄
cd "$USER_SERVICE_DIR"
echo "✅ 已切換到: $(pwd)"

# 檢查必要文件
if [ ! -f "src/main.ts" ]; then
    echo "❌ 錯誤: 找不到 src/main.ts 文件"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ 錯誤: 找不到 package.json 文件"
    exit 1
fi

echo ""
echo "🔧 設定環境變數 (修復亂碼問題)..."

# 設定編碼環境變數 (解決亂碼)
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export LC_CTYPE=en_US.UTF-8
export NODE_ENV=development

echo "   LANG: $LANG"
echo "   LC_ALL: $LC_ALL"
echo "   NODE_ENV: $NODE_ENV"

echo ""
echo "🔍 檢查依賴..."

# 檢查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules 不存在，執行 npm install..."
    npm install
fi

echo ""
echo "🚀 啟動 User Service..."
echo "   ✅ 無亂碼輸出"
echo "   ✅ 使用 ts-node 直接執行"
echo "   ✅ 編碼問題已修復"
echo ""
echo "🌐 服務將在以下地址運行:"
echo "   http://localhost:8004"
echo ""
echo "🛑 按 Ctrl+C 停止服務"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 使用 ts-node 直接執行 (這是避免亂碼的關鍵)
npx ts-node -r tsconfig-paths/register src/main.ts
