#!/bin/bash

# 避免亂碼的 NestJS 啟動腳本
echo "=== 跳過測試，直接啟動服務 ==="

# 設定編碼
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export NODE_ENV=development

echo "1. 清理舊的建置文件..."
rm -rf dist/

echo "2. 建置專案 (不執行測試)..."
npm run build 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ 建置成功"
    echo "3. 直接啟動編譯後的服務..."
    node dist/main.js
else
    echo "✗ 建置失敗，嘗試替代方案..."
    echo "4. 使用 ts-node 直接執行..."
    npx ts-node src/main.ts
fi
