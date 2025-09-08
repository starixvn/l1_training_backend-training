# SieBo SeDie Multiplayer WebSocket 規格文檔

## 概述

本文檔詳細描述了 **SieBo SeDie Multiplayer Service** 和 **Game Client** 之間的 WebSocket 通信規格。SeDie 是一個多人線上擲骰子遊戲，玩家可以在各種結果上下注。

---

## 連接資訊

### 服務端配置
- **服務名稱**: `sedie-multiplayer-service`
- **預設端口**: `8006` (本地開發)
- **命名空間**: `/user/sediemultiplayer`
- **完整 WebSocket URL**: `http://localhost:8006/user/sediemultiplayer`
- **Socket.IO 路徑**: `/socket.io`

### Socket 配置參數
```javascript
socketOptions: {
    pingInterval: 60000,          // 60 秒
    pingTimeout: 60000,           // 60 秒
    transports: ["websocket"],    // 僅使用 WebSocket
    allowUpgrades: false,         // 不允許協議升級
    perMessageDeflate: false,     // 關閉壓縮
    forceNew: true,               // 強制新連接
    upgrade: false                // 客戶端設定
}
```

---

## 遊戲基本資訊

### 遊戲設定
```typescript
{
    id: 148,                      // 遊戲 ID
    name: "SeDieMultiplayer",     // 遊戲名稱
    durations: {
        wholeRound: 23,           // 整輪時間 (秒)
        placingBets: 18,          // 下注階段 (秒)
        lockingBet: 3,            // 鎖定階段 (秒)
        shakeThePlateDuration: 1  // 搖骰子動畫 (秒)
    }
}
```

### 投注選項
```typescript
const SeDieBetOptions = {
    ODD: "odd",           // 奇數
    EVEN: "even",         // 偶數
    RED2: "red2",         // 紅色2
    RED3: "red3",         // 紅色3
    RED4: "red4",         // 紅色4
    WHITE3: "white3",     // 白色3
    WHITE4: "white4"      // 白色4
}

// 對沖下注限制
hedgeBetGroups: [["even", "odd"]]  // 不能同時下注奇數和偶數
```

---

## WebSocket 事件規格

### 1. 連接與認證

#### 1.1 客戶端 → 服務端

**連接建立**
```javascript
// Socket.IO 連接事件
socket.on('connect', () => {
    console.log('Connected to sedie-multiplayer-service');
    socket.emit('signin', sessionData);
});
```

**用戶登入 - `signin`**
```javascript
socket.emit('signin', {
    // 會話資料
    token: "user_jwt_token",
    userId: "user_id",
    currencyGroupId: "currency_group",
    // 其他會話相關資訊
});
```

**進入遊戲 - `inGame`**
```javascript
socket.emit('inGame', 'SeDieMultiplayer');
```

#### 1.2 服務端 → 客戶端

**登入成功 - `signedIn`**
```javascript
socket.on('signedIn', () => {
    // 用戶成功登入，可以開始遊戲
});
```

**遊戲配置 - `gameConfigs`**
```javascript
socket.on('message', (data) => {
    if (data.gameConfigs) {
        // 遊戲設定資訊
        // 包含遊戲規則、賠率等資訊
    }
});
```

### 2. 下注系統

#### 2.1 客戶端 → 服務端

**下注請求 - `bet`**
```javascript
socket.emit('bet', {
    betChoices: {
        "odd": 100,      // 在奇數上下注 100
        "red3": 50       // 在紅3上下注 50
    },
    amount: 150,         // 總下注金額
    clientSeed: "client_generated_seed",
    freeBet: false,      // 是否免費下注
    roundId: 12345,      // 當前回合 ID
    m: "Landscape"       // 顯示模式
});
```

**重複下注 - `rebet`**
```javascript
socket.emit('rebet', {
    betChoices: {
        "even": 200,     // 重複上次下注模式
        "white4": 100
    },
    amount: 300,
    clientSeed: "new_client_seed",
    freeBet: false,
    roundId: 12346
});
```

#### 2.2 服務端 → 客戶端

**遊戲事件 - `sediemultiplayer`**
```javascript
socket.on('sediemultiplayer', (message) => {
    // 所有遊戲相關事件都通過此事件傳送
    console.log('Game event:', message);
});
```

**用戶下注資訊 - `ownBets`**
```javascript
// 透過 message 事件接收
{
    ownBets: {
        playerId: "user_123",
        bets: [
            {
                betChoice: "odd",
                amount: 100,
                timestamp: "2024-01-01T12:00:00Z"
            }
        ],
        totalAmount: 100
    }
}
```

### 3. 遊戲狀態與結果

#### 3.1 服務端 → 客戶端

**遊戲狀態 - `roundState`**
```javascript
{
    roundState: {
        phase: "placingBets",    // 遊戲階段: placingBets | lockingBet | result
        roundId: 12345,
        timeRemaining: 15        // 剩餘時間(秒)
    }
}
```

**剩餘時間 - `remainingTime`**
```javascript
{
    remainingTime: {
        seconds: 10,            // 剩餘秒數
        phase: "placingBets"    // 當前階段
    }
}
```

**遊戲結果 - `finish`**
```javascript
{
    finish: {
        dice: [3, 4, 2],           // 骰子結果
        winningChoice: "odd",       // 獲勝選項
        totalSum: 9,               // 骰子總和
        results: {
            "odd": { isWin: true, payout: 1.98 },
            "even": { isWin: false, payout: 0 },
            "red3": { isWin: true, payout: 5.5 }
        },
        roundId: 12345,
        timestamp: "2024-01-01T12:00:00Z"
    }
}
```

**玩家結果面板 - `playerResultBoard`**
```javascript
{
    playerResultBoard: {
        totalPlayers: 156,        // 總玩家數
        totalBets: 25000,         // 總下注金額
        winnerCount: 78,          // 獲勝玩家數
        biggestWin: {
            playerId: "player_456",
            amount: 5000,
            choice: "red4"
        }
    }
}
```

### 4. 歷史與統計

#### 4.1 服務端 → 客戶端

**回合歷史 - `roundHistory`**
```javascript
{
    roundHistory: [
        {
            roundId: 12344,
            dice: [1, 6, 3],
            winningChoice: "even",
            totalSum: 10,
            timestamp: "2024-01-01T11:58:00Z"
        },
        {
            roundId: 12343,
            dice: [2, 2, 3],
            winningChoice: "odd",
            totalSum: 7,
            timestamp: "2024-01-01T11:56:00Z"
        }
        // 更多歷史記錄...
    ]
}
```

**總下注統計 - `totalBets`**
```javascript
{
    totalBets: {
        "odd": {
            amount: 15000,
            percentage: 35.5,
            playerCount: 89
        },
        "even": {
            amount: 12000,
            percentage: 28.4,
            playerCount: 67
        },
        "red3": {
            amount: 8000,
            percentage: 18.9,
            playerCount: 45
        }
        // 其他選項...
    }
}
```

### 5. 錯誤處理

#### 5.1 服務端 → 客戶端

**API 錯誤 - `apiError`**
```javascript
{
    apiError: {
        code: "INSUFFICIENT_BALANCE",
        message: "餘額不足",
        details: {
            required: 1000,
            available: 500
        }
    }
}
```

**系統維護 - `um` (Under Maintenance)**
```javascript
{
    um: {
        message: "系統維護中，請稍後再試",
        estimatedTime: "30分鐘"
    }
}
```

**連接錯誤事件**
```javascript
socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
});

socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason);
});
```

### 6. 用戶餘額與資訊

#### 6.1 服務端 → 客戶端

**用戶資訊 - `user`**
```javascript
{
    user: {
        id: "user_123",
        name: "PlayerName",
        balance: 10000,
        currency: "USD",
        level: "VIP",
        maxBet: 5000,
        minBet: 10
    }
}
```

**餘額更新 - `updatePlayerBalance`**
```javascript
{
    updatePlayerBalance: {
        newBalance: 9500,
        change: -500,           // 變動金額
        reason: "bet_placed"    // 變動原因
    }
}
```

---

## 下注驗證規則

### 1. 基本驗證
```typescript
// 最小/最大下注限制
minBet: player.profile.minBet,
maxBet: Math.min(player.profile.maxBet, settings.maxBet)

// 單選項最大下注
maxBetPerChoice: settings.maxBetPerChoices[choice]

// 總下注不能超過最大限制
totalAmount <= maxBet
```

### 2. 對沖下注檢查
```typescript
// 不允許同時下注奇數和偶數
hedgeBetGroups: [["even", "odd"]]

// 如果玩家同時下注這兩個選項，系統會拒絕
if (playerBets.includes("even") && playerBets.includes("odd")) {
    return { error: "不允許對沖下注" };
}
```

### 3. 免費下注驗證
```typescript
// 檢查遊戲是否啟用免費下注功能
if (freeBet && !gameConfigs.enableFreeBet) {
    return { error: "免費下注未啟用" };
}
```

---

## 消息格式規範

### 1. 事件命名規則
- 客戶端發送事件：小寫名詞 (`signin`, `bet`, `rebet`, `inGame`)
- 服務端發送事件：駝峰式或描述性 (`signedIn`, `playerResultBoard`)

### 2. 數據格式
- 所有時間戳使用 ISO 8601 格式
- 金額使用數字類型（整數，以分為單位）
- 玩家 ID 使用字符串格式

### 3. 錯誤格式
```typescript
{
    error: {
        code: "ERROR_CODE",
        message: "可讀的錯誤訊息",
        details?: object        // 可選的詳細資訊
    }
}
```

---

## 技術實現細節

### 1. 服務端架構
```
sedie-multiplayer-service/
├── src/
│   ├── routers/
│   │   └── socket-router.ts          # WebSocket 事件路由
│   ├── consumers/
│   │   ├── user-signin-consumer.ts   # 用戶登入處理
│   │   ├── rebet-consumer.ts         # 重複下注處理
│   │   └── settle-game-round-consumer.ts  # 結算處理
│   ├── publishers/
│   │   └── player-result-board-publisher.ts  # 結果發布
│   ├── crons/
│   │   ├── game-cron.ts              # 遊戲定時任務
│   │   └── game-bot.ts               # 機器人下注
│   └── models/
│       └── betlogs.ts                # 下注記錄模型
```

### 2. 客戶端架構
```
game-client/src/games/sedie-multiplayer/
├── page.tsx                          # 主遊戲組件
├── sedie-multiplayer-constants.ts    # 常數定義
├── sedie-multiplayer-game-round-data-handler.ts  # 遊戲數據處理
├── bet-options/                      # 下注選項組件
├── result-block/                     # 結果顯示組件
├── scoreboard/                       # 計分板組件
└── history/                          # 歷史記錄組件
```

### 3. 基礎類別繼承
- 服務端：`SocketRouter extends BaseSocketRouter`
- 客戶端：`SeDieMultiPlayer extends GameBase`

---

## 開發與調試

### 1. 本地測試命令
```bash
# 測試 SeDie 連接
node test-sedie-signin.js

# 檢查服務狀態
./check-status.sh

# 啟動所有服務
./start-services.sh
```

### 2. 調試日誌
```javascript
// 客戶端調試
console.log('[SOCKET] 📨 sediemultiplayer event content:', message);

// 服務端調試
console.log('[SeDie UserSigninConsumer] 🎯 handleSignInSuccess called');
```

### 3. 常見問題排查
1. **連接失敗**：檢查端口 8006 是否可用
2. **認證失敗**：確認 JWT token 有效性
3. **下注被拒**：檢查餘額和下注限制
4. **消息未接收**：確認事件監聽器已正確註冊

---

## 版本資訊

- **文檔版本**: 1.0
- **遊戲 ID**: 148
- **服務版本**: sedie-multiplayer-service
- **最後更新**: 2024年

---

*本文檔涵蓋了 SieBo SeDie Multiplayer 的完整 WebSocket 通信規格。如有疑問或需要更新，請聯繫開發團隊。*
