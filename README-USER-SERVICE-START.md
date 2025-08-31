# 🚀 User Service 一鍵啟動指南

## 🎯 解決的問題

- ✅ **macOS 亂碼問題** - 完全解決終端亂碼顯示
- ✅ **目錄路徑問題** - 自動切換到正確目錄
- ✅ **依賴相容性** - 自動檢查和處理依賴
- ✅ **跨平台支援** - macOS, Linux 和 Windows

## 🚀 快速啟動

### macOS / Linux
```bash
# 從專案根目錄執行
./start-user-service.sh
```

### Windows
```cmd
# 從專案根目錄執行
start-user-service.bat
```

## 📋 詳細說明

### 腳本功能
1. **自動目錄切換** - 自動切換到 `services/user-service`
2. **環境變數設定** - 設定正確的編碼環境變數
3. **依賴檢查** - 自動檢查和安裝依賴
4. **無亂碼啟動** - 使用 `ts-node` 避免亂碼問題
5. **錯誤檢測** - 檢查必要文件是否存在

### 服務資訊
- **端口**: 8004
- **URL**: http://localhost:8004
- **API 文檔**: http://localhost:8004/api (開發環境)

## 🔧 故障排除

### 如果腳本執行失敗
1. **檢查目錄結構**:
   ```
   backend-training/
   ├── start-user-service.sh    # macOS/Linux
   ├── start-user-service.bat   # Windows  
   └── services/
       └── user-service/
           └── src/
               └── main.ts
   ```

2. **檢查權限** (macOS/Linux):
   ```bash
   chmod +x start-user-service.sh
   ```

3. **檢查 Node.js 版本**:
   ```bash
   node --version  # 建議 v18+ 
   npm --version
   ```

### 常見問題

**Q: 仍然看到亂碼**
A: 確保使用提供的腳本，不要使用 `yarn start` 或 `nest start`

**Q: MongoDB 連接失敗**
A: 確保 MongoDB 服務正在運行:
```bash
# macOS (Homebrew)
brew services start mongodb-community

# 檢查狀態
brew services list | grep mongodb
```

**Q: 端口 8004 被占用**
A: 檢查並關閉占用端口的程序:
```bash
lsof -i :8004
kill -9 PID
```

## 📁 其他可用腳本

在 `services/user-service/` 目錄中還有其他診斷和啟動腳本:

| 腳本 | 用途 |
|------|------|
| `start-working.sh` | 本地版本（需在 user-service 目錄執行） |
| `debug-encoding.sh` | 編碼問題診斷 |
| `start-direct.sh` | 直接編譯啟動 |
| `MACOS_PROBLEM_SOLVED.md` | 完整問題解決說明 |

## ✅ 成功標誌

看到以下訊息表示啟動成功:
```
[Nest] Starting Nest application...
[Nest] InstanceLoader dependencies initialized
...
Application is running on: http://[::]:8004
```

---

**解決時間**: 2025-08-31  
**適用系統**: macOS, Linux, Windows  
**問題狀態**: ✅ 已解決
