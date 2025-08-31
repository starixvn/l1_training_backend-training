#!/bin/bash

# Clean startup script for macOS encoding fix
echo "=== 啟動清理腳本 (Clean Startup Script) ==="
echo "設定環境變數..."

# Set proper encoding
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export TERM=xterm-256color

# Show current settings
echo "LANG: $LANG"
echo "LC_ALL: $LC_ALL" 
echo "TERM: $TERM"

echo "=== 嘗試不同的啟動方式 ==="

echo "方法 1: 使用 npm run start:dev 並過濾輸出..."
npm run start:dev | iconv -f utf-8 -t utf-8 2>/dev/null

echo "如果上述方法失敗，嘗試方法 2..."
sleep 2

echo "方法 2: 使用 node 直接啟動..."
npm run build 2>/dev/null
node dist/main.js | tr -cd '\11\12\15\40-\176' 2>/dev/null

echo "如果還是有問題，嘗試方法 3..."
sleep 2

echo "方法 3: 使用 LC_CTYPE 設定..."
LC_CTYPE=en_US.UTF-8 npm run start:dev 2>/dev/null
