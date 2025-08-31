#!/bin/bash

# 🎉 工作版本 - 無亂碼啟動腳本
echo "=== 🚀 User Service 無亂碼啟動 ==="

# 設定編碼環境
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export NODE_ENV=development

# 暫時禁用有問題的功能 (如果需要)
export DISABLE_MONGOOSE=true

echo "✓ 編碼環境已設定"
echo "✓ 使用 ts-node 直接執行"
echo "✓ 跳過有問題的依賴"

echo ""
echo "🔥 啟動服務中..."
echo "   如果遇到 Mongoose 錯誤，這是預期的，服務仍可運行"
echo ""

# 使用 ts-node 直接執行，這個方法已確認無亂碼
npx ts-node -r tsconfig-paths/register src/main.ts
