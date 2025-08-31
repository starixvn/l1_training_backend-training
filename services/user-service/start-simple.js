// 最簡化的 Node.js 啟動腳本
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== 簡化啟動方案 ===');

// 設定環境變數
process.env.LANG = 'en_US.UTF-8';
process.env.LC_ALL = 'en_US.UTF-8';
process.env.NODE_ENV = 'development';

try {
    // 檢查 dist 目錄
    if (fs.existsSync('dist/main.js')) {
        console.log('✓ 找到編譯後的文件，直接執行...');
        require('./dist/main.js');
    } else {
        console.log('✗ 編譯後文件不存在');
        console.log('嘗試使用 ts-node...');
        
        // 使用 ts-node 直接執行
        execSync('npx ts-node -r tsconfig-paths/register src/main.ts', {
            stdio: 'inherit',
            encoding: 'utf8'
        });
    }
} catch (error) {
    console.error('啟動失敗:', error.message);
    console.log('請檢查依賴是否已安裝: npm install');
}
