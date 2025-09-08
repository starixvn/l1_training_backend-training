# SieBo SeDie Multiplayer - API Integration & Unit Testing 指南

## 概述

本指南詳細說明如何對 **SieBo SeDie Multiplayer Service** 進行 API 集成測試和單元測試。該服務採用完整的測試架構，包含單元測試、集成測試和端到端測試。

---

## 測試架構概覽

### 測試分類
```
tests/
├── unit-tests/              # 單元測試
│   ├── consumers/           # 消費者測試
│   ├── crons/              # 定時任務測試
│   ├── publishers/         # 發布器測試
│   ├── routers/            # 路由測試
│   └── helpers/            # 輔助函數測試
└── integration-tests/       # 集成測試
    ├── test-suites/        # 測試套件
    ├── _stubs/             # 測試數據和模擬
    ├── helper/             # 測試輔助工具
    └── game-service-setup/ # 服務設置
```

### 測試框架與工具
- **Jest**: 主要測試框架
- **TypeScript**: 類型安全的測試代碼
- **sc-game-service-integration-utils**: 集成測試工具包
- **mongoose**: 數據庫操作
- **Socket.IO**: WebSocket 測試

---

## 單元測試 (Unit Tests)

### 配置檔案

**jest.config.cjs**
```javascript
{
    rootDir: "./",
    verbose: true,
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverageFrom: [
        "src/{consumers,crons,publishers,helpers}/**/*.ts",
        "!src/**/*.d.ts"
    ],
    coveragePathIgnorePatterns: [
        "/node_modules/", 
        "src/.*\\.(models|configs)\\.ts$"
    ]
}
```

### 執行單元測試

```bash
# 執行所有單元測試
npm run test

# 執行測試覆蓋率報告
npm run test-coverage

# 執行特定測試文件
npx jest tests/unit-tests/consumers/rebet-consumer.test.ts

# 監聽模式執行測試
npx jest --watch
```

### 單元測試範例

#### 1. Consumer 測試

**測試 RebetConsumer**
```typescript
import RebetConsumer from "../../../src/consumers/rebet-consumer";
import { BET_CHOICES } from "../../../src/constants";

describe("RebetConsumer", () => {
    let rebetConsumer: RebetConsumer;
    let mockGameData: any;
    let mockPlayer: any;

    beforeEach(() => {
        mockGameData = {
            ingame: {},
            currencyGroupGames: [{
                groupId: "1",
                minBet: 10,
                maxBet: 5000,
                maxBetPerChoices: {
                    [BET_CHOICES.odd]: 1000,
                    [BET_CHOICES.even]: 1000
                }
            }],
            gameConfigs: { enableFreeBet: true },
            roundId: 123
        };

        mockPlayer = {
            profile: {
                name: "testPlayer",
                minBet: 5,
                maxBet: 1500
            },
            session: {
                currencyGroupId: "1",
                currencyName: "USD"
            }
        };
    });

    describe("mergeBetTracks", () => {
        it("should merge new bet choices with existing bet tracks", () => {
            // Arrange
            const existingBetTracks = { even: 200, red2: 100 };
            mockGameData.ingame["testPlayer"] = { betTracks: existingBetTracks };
            const newBetChoices = { even: 50, odd: 75 };

            // Act
            const result = rebetConsumer.mergeBetTracks("testPlayer", newBetChoices);

            // Assert
            expect(result).toEqual({
                even: 250,  // 200 + 50
                odd: 75,
                red2: 100
            });
        });
    });

    describe("composeBetAmountValidationCriteria", () => {
        it("should return validation criteria for free bet when disabled", () => {
            // Arrange
            mockGameData.gameConfigs.enableFreeBet = false;
            const betChoices = { even: 100 };

            // Act
            const result = rebetConsumer.composeBetAmountValidationCriteria(
                mockPlayer, betChoices, 100, true
            );

            // Assert
            expect(result[0].failure).toBe(true);
            expect(result[0].notice).toEqual({ errorCode: "INVALID_BET" });
        });
    });
});
```

#### 2. Publisher 測試

**測試 PlayerResultBoardPublisher**
```typescript
import PlayerResultBoardPublisher from "../../../src/publishers/player-result-board-publisher";

describe("PlayerResultBoardPublisher", () => {
    let publisher: PlayerResultBoardPublisher;

    beforeEach(() => {
        publisher = new PlayerResultBoardPublisher({} as any, {} as any);
        publisher.publishToUser = jest.fn();
        publisher.publishToAllUsers = jest.fn();
    });

    it("should call publishToUser with correct arguments", () => {
        publisher.publishBoardDataToUser("player1", { board: "data" });
        expect(publisher.publishToUser).toHaveBeenCalledWith("player1", { board: "data" });
    });

    it("should call publishToAllUsers for board updates", () => {
        publisher.publishBoardUpdate({ board: "update" });
        expect(publisher.publishToAllUsers).toHaveBeenCalledWith({ board: "update" });
    });
});
```

#### 3. Socket Router 測試

**測試 SocketRouter**
```typescript
import SocketRouter from "../../../src/routers/socket-router";

describe("SocketRouter", () => {
    let socketRouter: SocketRouter;
    let mockSocketClient: any;
    let mockRebetConsumer: any;

    beforeEach(() => {
        mockRebetConsumer = { consume: jest.fn() };
        mockSocketClient = { 
            on: jest.fn(), 
            id: "socket123" 
        };
        
        socketRouter = new SocketRouter({ rebetConsumer: mockRebetConsumer });
        socketRouter.socketClient = mockSocketClient;
        socketRouter.gameData = { realPlayers: {} };
        socketRouter.verify = jest.fn().mockReturnValue(true);
    });

    it("should register rebet event handler on init", () => {
        socketRouter.init(mockSocketClient);
        expect(mockSocketClient.on).toHaveBeenCalledWith("rebet", expect.any(Function));
    });

    it("should handle rebet event correctly", () => {
        const payload = { betChoices: { odd: 100 } };
        const mockPlayer = { profile: { name: "test" } };
        socketRouter.gameData.realPlayers["socket123"] = mockPlayer;

        socketRouter.handleRebet(payload);

        expect(mockRebetConsumer.consume).toHaveBeenCalledWith(mockPlayer, payload);
    });
});
```

---

## 集成測試 (Integration Tests)

### 配置檔案

**jest.integration-test.config.cjs**
```javascript
{
    rootDir: "./",
    preset: "ts-jest",
    testEnvironment: "node",
    globalSetup: "<rootDir>/tests/integration-tests/global-setup.cjs",
    globalTeardown: "<rootDir>/tests/integration-tests/global-teardown.cjs",
    testTimeout: 20000
}
```

### 執行集成測試

```bash
# 執行集成測試（會自動構建服務）
npm run integration-test

# 手動構建後執行
npm run build
npx jest --config ./jest.integration-test.config.cjs
```

### 集成測試架構

#### 1. 測試設置 (Global Setup)

**global-setup.cjs**
```javascript
// 1. 創建測試數據
const startSetupDataProcess = () => {
    const setupDataProcess = spawn("node", [
        "--experimental-loader=extensionless", 
        "./tests/integration-tests/_stubs/test-data-setup.js"
    ]);
    // 創建用戶、貨幣、遊戲配置等測試數據
};

// 2. 啟動測試服務
const startServiceProcess = () => {
    const serviceProcess = spawn("node", [
        "--experimental-loader=extensionless",
        "./tests/integration-tests/game-service-setup/game-service-app.js"
    ]);
    // 等待服務啟動完成
};
```

#### 2. 測試數據準備

**test-data-setup.js**
```javascript
export const createTestData = async () => {
    await connectDatabase();
    await createExchangeRate();
    await createGameConfig(gameConfig);
    await createDummyCurrency(partnerConfig.partnerId, currencyData.code, currencyData.name);
    await createDummyUsers(currency);
    await createGameData();  // 創建遊戲結果和回合數據
    await createUserBetData();  // 創建用戶下注數據
};

const gameConfig = {
    type: 0,
    name: "sediemultiplayer",
    minBet: 1,
    maxBet: 3000,
    maxBetPerChoices: { 
        even: 3000, odd: 3000, red3: 3000, 
        white3: 3000, red4: 1000, white4: 1000, red2: 3000 
    },
    odds: { 
        even: 1.97, odd: 1.97, red3: 3.76, 
        white3: 3.76, red4: 14.5, white4: 14.5, red2: 2.5 
    }
};
```

#### 3. 集成測試範例

**登入測試**
```javascript
import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { socketOptionsFunc } from "../_stubs/test-data";
import appConfigs from "../../../build/app-configs.IGT";

const socketOptions = socketOptionsFunc(appConfigs.hostingPort);

describe("signin", () => {
    it("should receive signed in response", async () => {
        // Arrange
        const client = new GameClientDriver(socketOptions, initUserSession(normalUser));

        // 定期發送登入請求
        const sendSignInInterval = setInterval(() => {
            client.sendSignInEvent();
        }, 500);

        // Act & Assert
        await client.handleSignedInEvent();
        
        clearInterval(sendSignInInterval);
        client.close();
    });
});
```

**下注測試**
```javascript
describe("when place bet", () => {
    let client;

    beforeAll(async () => {
        client = new GameClientDriver(socketOptions, initUserSession(normalUser));
        
        // 等待登入完成
        await client.handleSignedInEvent();
        client.sendInGameEvent();
    });

    it("should return own bet data", async () => {
        // Arrange - 等待遊戲進入下注階段
        const inGameData = await client.handleGameEvent((data) => data.remainingTime);
        const timeout = getTimeOutToPlacingBetTime(inGameData.remainingTime, gameSettings.durations) * 1000;

        // Act - 在下注時間內發送下注
        setTimeout(() => {
            client.emit("bet", { 
                betChoice: "odd", 
                amount: 100, 
                clientSeed: "1000" 
            });
        }, timeout);

        // Assert - 驗證下注結果
        const data = await client.handleGameEvent((data) => data.endBet);
        expect(data.endBet).toEqual(100);
    });

    it("should reject bet without valid client seed", async () => {
        // 測試沒有客戶端種子的下注應該被拒絕
        const data = await client.handleGameEvent((data) => data.endBet);
        expect(data.endBet).toEqual(-1);
    });
});
```

**結算測試**
```javascript
describe("when settle game round", () => {
    it("should receive settlement results", async () => {
        // Arrange
        const client = new GameClientDriver(socketOptions, initUserSession(normalUser));
        await client.handleSignedInEvent();

        // Act - 等待遊戲結算
        const settlementData = await client.handleGameEvent((data) => data.finish);

        // Assert - 驗證結算數據
        expect(settlementData.finish).toHaveProperty('dice');
        expect(settlementData.finish).toHaveProperty('winningChoice');
        expect(settlementData.finish.dice).toHaveLength(3);
        
        client.close();
    });
});
```

---

## API 測試工具與輔助函數

### 1. GameClientDriver 使用

```javascript
import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";

// 建立客戶端連接
const client = new GameClientDriver(socketOptions, userSession);

// 發送事件
client.emit("bet", betPayload);
client.sendSignInEvent();
client.sendInGameEvent();

// 監聽事件
client.on("connect", callback);
client.on("disconnect", callback);

// 處理遊戲事件
const data = await client.handleGameEvent((data) => data.finish);
await client.handleSignedInEvent();
```

### 2. 時間計算輔助函數

```javascript
// 計算到下注時間的延遲
export const getTimeOutToPlacingBetTime = (remainingTime, durations) => {
    let timeout = 0;
    if (remainingTime <= durations.lockingBet) {
        timeout = remainingTime + durations.wholeRound - durations.placingBets + 2;
    } else if (remainingTime >= durations.placingBets) {
        timeout = remainingTime - durations.placingBets + 1;
    }
    return timeout;
};

// 計算到結算時間的延遲
export const getTimeOutToSettleTime = (remainingTime, durations) => {
    let timeout = 0;
    if (remainingTime <= durations.placingBets) {
        timeout = remainingTime + 1.5;
    }
    return timeout;
};
```

### 3. 用戶會話初始化

```javascript
export const initUserSession = (user) => {
    return {
        session: `${user.playerId}-session-id`,
        ss: `${user.playerId}-session-id`,
        currency: "$US",
        username: `${user.playerId}_${user.playerName}`,
        browserUserAgent: "browser-user-agent"
    };
};
```

---

## 測試數據管理

### 1. 測試用戶數據

```javascript
// 來自 sc-game-service-integration-utils
import { normalUser } from "sc-game-service-integration-utils";

const normalUser = {
    playerId: 1,
    playerName: "NormalUser",
    balance: 10000,
    currency: "USD"
};
```

### 2. 遊戲測試數據

```javascript
const gameConfig = {
    minBet: 1,
    maxBet: 3000,
    maxBetPerChoices: {
        even: 3000, odd: 3000, red3: 3000,
        white3: 3000, red4: 1000, white4: 1000, red2: 3000
    },
    odds: {
        even: 1.97, odd: 1.97, red3: 3.76,
        white3: 3.76, red4: 14.5, white4: 14.5, red2: 2.5
    }
};

const userBetData = (uid) => [{
    uid: uid,
    betwin: 0,
    currency: "$US",
    even: 100,
    playerId: 1,
    name: "NormalUser",
    odds: gameConfig.odds,
    roundId: 1,
    paid: true
}];
```

### 3. Provably Fair 測試數據

```javascript
const pfResults = [{
    clientSeeds: [],
    roundId: 1,
    serverSeedHash: "833d21eb4a79b5d4e7aaa46c2dea31febcfea28cac097b95d7da1cc364c03f41",
    serverSeed: '{"random":"52;64;28;59","secret":"pTd2onBR3lReJeAt7X0LaPB8ahemhx0C"}',
    finalHash: "cd64e519c7b78d977c0a0a571615a290b68ba1dcb745a9ca8bcf65352ea25dec574465c55416e3e31dc94f18dfd7cba012764b3c6220959bdb5a30a266ad349b"
}];
```

---

## 測試最佳實踐

### 1. 單元測試最佳實踐

#### 測試結構
```typescript
describe("ComponentName", () => {
    let component: ComponentType;
    let mockDependency: any;

    beforeEach(() => {
        // 設置測試環境
        mockDependency = { method: jest.fn() };
        component = new ComponentType(mockDependency);
    });

    describe("methodName", () => {
        it("should return expected result when given valid input", () => {
            // Arrange
            const input = "validInput";
            const expectedOutput = "expectedOutput";

            // Act
            const result = component.methodName(input);

            // Assert
            expect(result).toEqual(expectedOutput);
            expect(mockDependency.method).toHaveBeenCalledWith(input);
        });

        it("should throw error when given invalid input", () => {
            // Arrange & Act & Assert
            expect(() => component.methodName(null)).toThrow();
        });
    });
});
```

#### Mock 策略
```typescript
// 1. Mock 外部依賴
jest.mock("sc-common", () => ({
    helpers: {
        noticeHelper: {
            invalidBet: "INVALID_BET",
            maxBet: "MAX_BET"
        }
    }
}));

// 2. Mock 父類方法
jest.mock("sc-game-base/src/core/event-consumers/place-bet-consumer", () => {
    return class BasePlaceBetConsumer {
        getNoticeObj = jest.fn();
    };
});

// 3. Mock 實例方法
beforeEach(() => {
    component.methodToMock = jest.fn().mockReturnValue("mockValue");
});
```

### 2. 集成測試最佳實踐

#### 異步測試處理
```javascript
describe("async operations", () => {
    it("should handle async events correctly", async () => {
        // 使用 Promise 包裝異步操作
        const result = await new Promise((resolve) => {
            client.on("eventName", (data) => {
                resolve(data);
            });
            
            // 觸發事件
            client.emit("triggerEvent", payload);
        });

        expect(result).toHaveProperty("expectedField");
    });

    it("should timeout if event not received", async () => {
        // 設置超時
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Timeout")), 5000);
        });

        const eventPromise = client.handleGameEvent((data) => data.eventType);

        await expect(Promise.race([eventPromise, timeoutPromise])).resolves.toBeDefined();
    });
});
```

#### 測試隔離
```javascript
describe("isolated test suite", () => {
    let client;

    beforeEach(async () => {
        // 每個測試前重新創建客戶端
        client = new GameClientDriver(socketOptions, initUserSession(normalUser));
        await client.handleSignedInEvent();
    });

    afterEach(() => {
        // 清理資源
        if (client) {
            client.close();
            client = null;
        }
    });
});
```

### 3. 測試覆蓋率

#### 覆蓋率配置
```javascript
// jest.config.cjs
{
    collectCoverageFrom: [
        "src/{consumers,crons,publishers,helpers}/**/*.ts",
        "!src/**/*.d.ts"  // 排除類型定義文件
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
}
```

#### 覆蓋率報告
```bash
# 生成覆蓋率報告
npm run test-coverage

# 查看 HTML 報告
open coverage/lcov-report/index.html
```

---

## 調試與故障排除

### 1. 常見測試問題

#### Socket 連接問題
```javascript
// 問題：Socket 連接超時
// 解決：增加重試機制
export const checkConnect = (socketOptions, callback) => {
    const client = new GameClientDriver(socketOptions, initUserSession(normalUser));
    
    client.on("connect_error", () => {
        setTimeout(() => {
            checkConnect(socketOptions, callback);  // 重試連接
        }, 1000);
    });
    
    client.on("connect", () => {
        client.close();
        setTimeout(callback, 2000);  // 等待穩定後執行回調
    });
};
```

#### 異步測試超時
```javascript
// 問題：測試超時
// 解決：適當設置超時時間
describe("long running test", () => {
    it("should complete within timeout", async () => {
        // 設置較長的超時時間
        jest.setTimeout(30000);
        
        const result = await longRunningOperation();
        expect(result).toBeDefined();
    }, 30000);  // 也可以在這裡設置
});
```

#### 數據庫狀態問題
```javascript
// 問題：測試間數據污染
// 解決：每次測試後清理數據
afterEach(async () => {
    // 清理測試數據
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
});
```

### 2. 測試日誌與監控

```javascript
// 啟用詳細日誌
describe("with logging", () => {
    beforeAll(() => {
        // 設置測試環境日誌級別
        process.env.LOG_LEVEL = "debug";
    });

    it("should log important events", () => {
        const consoleSpy = jest.spyOn(console, "log");
        
        component.methodWithLogging();
        
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining("Expected log message")
        );
        
        consoleSpy.mockRestore();
    });
});
```

---

## CI/CD 集成

### 1. GitHub Actions 配置

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run test
      - run: npm run test-coverage

  integration-tests:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:4.4
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run integration-test
```

### 2. 測試報告生成

```bash
# 生成 JUnit 報告（用於 CI 系統）
npm test -- --reporters=default --reporters=jest-junit

# 生成 SonarQube 報告
npm test -- --testResultsProcessor=jest-sonar-reporter
```

---

## 性能測試

### 1. 負載測試

```javascript
describe("Performance Tests", () => {
    it("should handle multiple concurrent connections", async () => {
        const clients = [];
        const connectionPromises = [];

        // 創建多個並發連接
        for (let i = 0; i < 50; i++) {
            const client = new GameClientDriver(socketOptions, initUserSession({
                ...normalUser,
                playerId: i
            }));
            clients.push(client);
            connectionPromises.push(client.handleSignedInEvent());
        }

        // 等待所有連接建立
        await Promise.all(connectionPromises);

        // 同時發送下注請求
        const betPromises = clients.map(client => 
            client.emit("bet", { betChoice: "odd", amount: 100, clientSeed: "test" })
        );

        await Promise.all(betPromises);

        // 清理
        clients.forEach(client => client.close());
    });
});
```

### 2. 記憶體洩漏測試

```javascript
describe("Memory Leak Tests", () => {
    it("should not leak memory on repeated operations", () => {
        const initialMemory = process.memoryUsage().heapUsed;

        // 執行大量操作
        for (let i = 0; i < 1000; i++) {
            const consumer = new RebetConsumer(definition, gameData, undefined);
            consumer.consume(mockPlayer, mockPayload);
        }

        // 強制垃圾回收
        if (global.gc) {
            global.gc();
        }

        const finalMemory = process.memoryUsage().heapUsed;
        const memoryIncrease = finalMemory - initialMemory;

        // 記憶體增長不應該超過閾值
        expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB
    });
});
```

---

## 結論

SieBo SeDie Multiplayer 的測試架構提供了完整的測試解決方案：

### ✅ **優勢**
1. **完整覆蓋**: 單元測試 + 集成測試 + API 測試
2. **自動化**: 測試數據自動生成和清理
3. **真實環境**: 完整的服務啟動和 WebSocket 通信測試
4. **工具支持**: 豐富的測試工具和輔助函數

### 🎯 **測試策略**
1. **單元測試**: 測試個別組件的邏輯正確性
2. **集成測試**: 測試組件間的協作和 API 端點
3. **端到端測試**: 測試完整的用戶流程

### 🚀 **快速開始**
```bash
# 執行單元測試
npm run test

# 執行集成測試
npm run integration-test

# 查看覆蓋率報告
npm run test-coverage
```

通過這個測試架構，開發團隊可以確保 SeDie Multiplayer 服務的品質、穩定性和性能。

---

*本指南涵蓋了 SieBo SeDie Multiplayer 的完整測試方法。如需更多技術支持，請參考專案中的測試範例代碼。*
