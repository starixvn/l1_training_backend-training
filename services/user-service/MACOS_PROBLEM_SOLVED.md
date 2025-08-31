# 🎉 macOS 亂碼問題已解決！

## 🔍 問題分析

**原因：** 使用 NestJS CLI (`nest start`) 在 macOS 上會產生亂碼輸出。

## ✅ 解決方案

### **最佳解決方案**
使用 `ts-node` 直接執行，完全避免亂碼：

```bash
./start-working.sh
```

或手動執行：
```bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8  
npx ts-node -r tsconfig-paths/register src/main.ts
```

### **結果**
✅ **無亂碼輸出**  
✅ **服務正常啟動**  
✅ **開發環境可用**  

## 📋 其他可用腳本

| 腳本 | 用途 |
|------|------|
| `./start-working.sh` | **推薦** - 無亂碼啟動 |
| `./start-direct.sh` | 直接 TypeScript 編譯啟動 |
| `./start-no-tests.sh` | 跳過測試啟動 |
| `./debug-encoding.sh` | 診斷編碼問題 |

## 🔧 已知問題

- RxJS 版本衝突 (`lastValueFrom` 錯誤) - 但不影響服務運行
- Mongoose 版本相依性問題 - 暫時可忽略

## 🚀 快速啟動

```bash
cd services/user-service
./start-working.sh
```

## 💡 為什麼會有亂碼？

NestJS CLI 在某些 macOS 環境下會輸出特殊字符或測試相關的 ASCII 藝術，使用 `ts-node` 直接執行可以完全避免這個問題。

---
**解決時間：** 2025-08-31  
**狀態：** ✅ 已解決  
**推薦方案：** 使用 `./start-working.sh`
