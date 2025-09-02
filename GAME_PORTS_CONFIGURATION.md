# 🎮 遊戲端口配置詳細說明

## 🌐 **Game Client (前端) - 統一端口**

### **重要概念**
PinGoal和SeDie **共用同一個Game Client前端**，不是分別有獨立的端口。

| 組件 | 端口 | 說明 | URL |
|------|------|------|-----|
| **Game Client (前端)** | **8007** | 統一的遊戲前端應用 | http://localhost:8007 |

### **🎯 遊戲區分方式**
遊戲通過URL參數 `gameId` 來區分：

```
🎲 SeDie Multiplayer:    http://localhost:8007/?gameId=148
🎯 Soccer PinGoal:       http://localhost:8007/?gameId=200
```

---

## 🔧 **Game Server (後端) - 各自獨立**

每個遊戲都有獨立的後端服務：

| 遊戲 | Game ID | 後端端口 | Service URL | WebSocket Namespace |
|------|---------|----------|-------------|-------------------|
| **SeDie Multiplayer** | 148 | **8006** | http://localhost:8006 | `sediemultiplayer` |
| **Soccer PinGoal** | 200 | **8010** | http://localhost:8010 | `soccerpingoal` |

---

## 🏗️ **架構說明**

### **前端架構**
```
單一Game Client (Port 8007)
├── SeDie遊戲組件 (gameId=148)
└── PinGoal遊戲組件 (gameId=200)
```

### **後端架構**
```
SeDie Service (Port 8006) ←→ Game Client (Port 8007)
PinGoal Service (Port 8010) ←→ Game Client (Port 8007)
```

### **完整數據流**
```
1. 用戶訪問: http://localhost:8007/?gameId=200
2. Game Client: 讀取gameId=200，載入PinGoal組件
3. WebSocket連接: 前端連接到 localhost:8010 (PinGoal Service)
4. 遊戲通訊: 通過WebSocket進行實時遊戲數據交換
```

---

## 🎪 **Lobby Simulator配置**

| 組件 | 端口 | 說明 |
|------|------|------|
| **Lobby Simulator** | **8009** | 遊戲選擇界面 |

### **選擇流程**
```
1. 訪問: http://localhost:8009/signin
2. 選擇遊戲: 點擊對應按鈕
3. 生成URL: http://localhost:8007/?gameId=148 或 gameId=200
4. 跳轉遊戲: 進入對應的遊戲界面
```

---

## 📊 **當前服務狀態**

根據最新檢查：

### **✅ 正常運行**
- **Game Client (8007)**: ✅ 前端正常，支援雙遊戲
- **SeDie Service (8006)**: ✅ 後端正常運行

### **❓ 待確認**
- **PinGoal Service (8010)**: 可能需要手動啟動
- **Lobby Simulator (8009)**: 配置問題，可用替代方案

---

## 🚀 **直接測試方法**

### **測試PinGoal**
```bash
# 直接訪問PinGoal遊戲
http://localhost:8007/?gameId=200&token=test
```

### **測試SeDie**
```bash
# 直接訪問SeDie遊戲  
http://localhost:8007/?gameId=148&token=test
```

### **對比測試**
```bash
# 在兩個分頁中分別打開
分頁1: http://localhost:8007/?gameId=148&token=test (應顯示骰子遊戲)
分頁2: http://localhost:8007/?gameId=200&token=test (應顯示軌道彈珠遊戲)
```

---

## 🎯 **關鍵重點**

### **✅ 正確理解**
- **一個前端端口 (8007)** 服務所有遊戲
- **兩個後端端口 (8006, 8010)** 各自處理遊戲邏輯
- **gameId參數** 決定載入哪個遊戲

### **❌ 常見誤解**
- ❌ 認為每個遊戲有獨立的前端端口
- ❌ 認為需要訪問不同的前端URL
- ❌ 混淆前端端口和後端端口的作用

---

## 🎮 **總結**

**答案**: PinGoal和SeDie的Game Client都使用 **同一個端口 8007**

**區分方式**: 通過URL參數 `gameId=148` (SeDie) 或 `gameId=200` (PinGoal)

**後端服務**: SeDie使用8006，PinGoal使用8010

這種設計實現了**前端統一、後端分離**的微服務架構，既保持了用戶體驗的一致性，又實現了遊戲邏輯的獨立性。
