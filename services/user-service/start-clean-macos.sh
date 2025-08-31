#!/bin/bash

# macOS 編碼修復啟動腳本
echo "=== macOS 編碼修復啟動 ==="

# 設定編碼環境
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export LC_CTYPE=en_US.UTF-8
export TERM=xterm-256color

echo "1. 嘗試使用 start:prod (推薦)"
echo "2. 嘗試過濾亂碼輸出"
echo "3. 嘗試使用 --silent 模式"
echo ""

read -p "選擇方法 (1-3): " choice

case $choice in
  1)
    echo "=== 使用 production 模式啟動 ==="
    npm run build && npm run start:prod
    ;;
  2)
    echo "=== 過濾亂碼輸出模式 ==="
    npm run start:dev 2>/dev/null | grep -v "Carl Pilcher" | tr -cd '\11\12\15\40-\176'
    ;;
  3)
    echo "=== 安靜模式啟動 ==="
    npm run start:dev --silent
    ;;
  *)
    echo "使用預設方法..."
    npm run start:prod
    ;;
esac
