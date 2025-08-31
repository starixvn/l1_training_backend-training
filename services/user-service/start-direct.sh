#!/bin/bash

# 完全繞過 NestJS CLI 的啟動方案
echo "=== 直接啟動方案 (避免亂碼) ==="

# 設定編碼
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export NODE_ENV=development

echo "1. 使用 TypeScript 直接編譯..."
npx tsc --build tsconfig.json 2>/dev/null

if [ $? -eq 0 ] && [ -f "dist/main.js" ]; then
    echo "✓ TypeScript 編譯成功"
    echo "2. 直接使用 Node.js 啟動..."
    node dist/main.js
else
    echo "TypeScript 編譯失敗或文件不存在"
    echo "使用 ts-node 直接執行 TypeScript..."
    npx ts-node -r tsconfig-paths/register src/main.ts
fi
