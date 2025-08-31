#!/bin/bash

# macOS 亂碼診斷腳本
echo "=== macOS 亂碼診斷開始 ==="
echo "時間: $(date)"
echo ""

# 檢查環境變數
echo "1. 檢查環境變數:"
echo "   LANG: $LANG"
echo "   LC_ALL: $LC_ALL"
echo "   TERM: $TERM"
echo "   PWD: $PWD"
echo ""

# 檢查字符編碼支援
echo "2. 測試字符編碼支援:"
echo "   ASCII: Hello World"
echo "   UTF-8: 測試中文字符"
echo "   Unicode: $(echo -e '\u4e2d\u6587\u6e2c\u8a66')"
echo ""

# 檢查 Node.js 版本
echo "3. 檢查版本:"
echo "   Node.js: $(node --version)"
echo "   NPM: $(npm --version)"
echo "   NestJS CLI: $(npx @nestjs/cli --version 2>/dev/null || echo 'Not found')"
echo ""

# 檢查終端機資訊
echo "4. 終端機資訊:"
echo "   TERM_PROGRAM: $TERM_PROGRAM"
echo "   TERM_PROGRAM_VERSION: $TERM_PROGRAM_VERSION"
tput cols 2>/dev/null && echo "   終端寬度: $(tput cols) 字符"
tput lines 2>/dev/null && echo "   終端高度: $(tput lines) 行"
echo ""

# 設定編碼
echo "5. 設定編碼環境變數..."
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export LC_CTYPE=en_US.UTF-8
export TERM=xterm-256color
echo "   已設定編碼變數"
echo ""

# 逐步啟動診斷
echo "6. 逐步診斷啟動過程:"
echo ""

echo "步驟 1: 檢查 package.json..."
if [ -f "package.json" ]; then
    echo "   ✓ package.json 存在"
    echo "   啟動腳本: $(grep -A 3 '"scripts"' package.json | grep 'start' | head -1)"
else
    echo "   ✗ package.json 不存在"
    exit 1
fi
echo ""

echo "步驟 2: 檢查 node_modules..."
if [ -d "node_modules" ]; then
    echo "   ✓ node_modules 存在"
else
    echo "   ✗ node_modules 不存在，執行 npm install..."
    npm install
fi
echo ""

echo "步驟 3: 測試 NestJS CLI 直接執行..."
echo "   輸出將被過濾以查看亂碼來源"
echo "   === CLI 輸出開始 ==="
timeout 10s npx @nestjs/cli start 2>&1 | while IFS= read -r line; do
    # 檢查是否包含非 ASCII 字符
    if [[ "$line" =~ [^[:print:][:space:]] ]]; then
        echo "   [亂碼行] $line" | cat -v
    else
        echo "   [正常] $line"
    fi
done
echo "   === CLI 輸出結束 ==="
echo ""

echo "步驟 4: 測試 npm run start:dev..."
echo "   === NPM 輸出開始 ==="
timeout 10s npm run start:dev 2>&1 | while IFS= read -r line; do
    if [[ "$line" =~ [^[:print:][:space:]] ]]; then
        echo "   [亂碼行] $line" | cat -v
    else
        echo "   [正常] $line"
    fi
done
echo "   === NPM 輸出結束 ==="
echo ""

echo "步驟 5: 檢查是否有特殊測試檔案..."
find . -name "*.ts" -o -name "*.js" -o -name "*.json" | xargs grep -l "Carl.*Pilcher\|zalgo\|weird\|corrupt" 2>/dev/null | head -5
echo ""

echo "=== 診斷完成 ==="
