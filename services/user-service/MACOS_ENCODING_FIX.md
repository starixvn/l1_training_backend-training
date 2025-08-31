# macOS 終端機亂碼修復指南 (Terminal Encoding Fix Guide)

## 問題描述 (Problem Description)
在 macOS 上執行 `yarn start` 時出現大量亂碼，但在 Windows 上運行正常。

## 解決方案 (Solutions)

### 方案 1: 設定環境變數 (Set Environment Variables)
```bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export TERM=xterm-256color
```

### 方案 2: 使用不同的啟動命令 (Use Different Start Commands)
```bash
# 方法 1: 直接使用 node 啟動
npm run build
node dist/main.js

# 方法 2: 使用 start:prod
npm run start:prod

# 方法 3: 強制設定編碼後啟動
LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 yarn start

# 方法 4: 使用 script 包裝
echo '#!/bin/bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8  
yarn start' > start_fixed.sh
chmod +x start_fixed.sh
./start_fixed.sh
```

### 方案 3: 終端機設定 (Terminal Settings)

#### 對於 Terminal.app:
1. 開啟 Terminal 偏好設定
2. 選擇「描述檔」標籤
3. 確認字元編碼設為 UTF-8
4. 字體設定為支援 Unicode 的字體 (如 Monaco, SF Mono)

#### 對於 iTerm2:
1. 偏好設定 > Profiles > Terminal
2. 設定 Character Encoding 為 UTF-8
3. 偏好設定 > Profiles > Text
4. 選擇合適的字體 (推薦 Menlo, Monaco, 或 SF Mono)

### 方案 4: 檢查 NestJS CLI 版本 (Check NestJS CLI Version)
```bash
# 檢查版本
nest --version
npx @nestjs/cli --version

# 更新到最新版本
npm install -g @nestjs/cli@latest

# 或使用本地版本
npx @nestjs/cli start
```

### 方案 5: 清理並重建 (Clean and Rebuild)
```bash
# 清理 node_modules
rm -rf node_modules
rm package-lock.json

# 重新安裝
npm install

# 清理建置文件
npm run prebuild

# 重新建置
npm run build

# 啟動
npm run start:prod
```

### 方案 6: 使用 Docker (如果有的話)
```bash
# 如果有 Dockerfile，使用 Docker 執行可能避免編碼問題
docker build -t user-service .
docker run -p 3000:3000 user-service
```

### 方案 7: 偵錯模式 (Debug Mode)
```bash
# 使用 verbose 模式查看詳細輸出
DEBUG=* yarn start

# 或使用 NestJS 偵錯模式
npm run start:debug
```

## 永久修復 (Permanent Fix)
在 `~/.bash_profile` 或 `~/.zshrc` 中加入：
```bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export TERM=xterm-256color
```

然後重新載入：
```bash
source ~/.bash_profile  # 如果使用 bash
source ~/.zshrc         # 如果使用 zsh
```

## 測試命令 (Test Commands)
```bash
# 測試字元編碼
echo "測試中文字符顯示"

# 測試 Unicode
echo -e "\u4e2d\u6587\u6e2c\u8a66"

# 檢查終端機支援
locale -a | grep UTF-8
```
