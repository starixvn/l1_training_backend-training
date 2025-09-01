# Soccer PinGoal - 遊戲機制設計文件

## 🎲 隨機數生成機制

### 隨機數需求分析
每局遊戲需要以下隨機元素：

1. **對手軌道分配** - 從剩餘軌道中選擇
2. **軌道物件分佈** - 每條軌道的得分物件位置和分值  
3. **碰撞隨機因子** - 影響珠子碰撞結果的微調

### 隨機數分配方案
```typescript
interface RandomNumbers {
  opponentAllocation: number[];    // 5個隨機數用於對手分配
  objectDistribution: number[];   // 6個隨機數用於各軌道物件分佈
  collisionFactors: number[];     // 3個隨機數用於碰撞計算
}

// 總計需要 14 個隨機數
const REQUIRED_RANDOM_COUNT = 14;
```

## 🛤️ 軌道分配算法

### 對手軌道分配邏輯
```typescript
function allocateOpponentTunnels(
  playerTunnel: number,           // 玩家選擇的軌道 (1-6)
  opponentCount: number,          // 對手數量 (1-5)
  randomNumbers: number[]         // 隨機數組
): number[] {
  // 可用軌道：排除玩家軌道
  const availableTunnels = [1,2,3,4,5,6].filter(t => t !== playerTunnel);
  
  // 從可用軌道中隨機選擇對手數量的軌道
  const selectedTunnels: number[] = [];
  const shuffledTunnels = shuffleArray(availableTunnels, randomNumbers);
  
  return shuffledTunnels.slice(0, opponentCount);
}
```

### 洗牌算法實現
```typescript
function shuffleArray(array: number[], randomNumbers: number[]): number[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const randomIndex = randomNumbers[i % randomNumbers.length] % (i + 1);
    [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
  }
  return result;
}
```

## 🎯 得分物件系統

### 物件類型定義
```typescript
enum ObjectType {
  SMALL_GREEN = 1,    // 1分 - 綠色小圓形
  MEDIUM_YELLOW = 2,  // 2分 - 黃色三角形  
  LARGE_RED = 3       // 3分 - 紅色菱形
}

interface ScoreObject {
  type: ObjectType;
  position: number;      // 軌道內位置 (0-1)
  score: number;         // 分值
  hitProbability: number; // 被撞擊概率
}
```

### 物件分佈算法
```typescript
function generateTrackObjects(
  tunnelIndex: number,
  randomSeed: number
): ScoreObject[] {
  const objects: ScoreObject[] = [];
  
  // 每條軌道固定10個物件
  const OBJECTS_PER_TRACK = 10;
  
  // 分值分佈比例：1分(50%) 2分(30%) 3分(20%)
  const scoreDistribution = [
    ...Array(5).fill(1),  // 5個 1分物件
    ...Array(3).fill(2),  // 3個 2分物件
    ...Array(2).fill(3)   // 2個 3分物件
  ];
  
  // 使用隨機種子洗牌分值分佈
  const shuffledScores = shuffleWithSeed(scoreDistribution, randomSeed);
  
  // 生成物件位置
  for (let i = 0; i < OBJECTS_PER_TRACK; i++) {
    objects.push({
      type: shuffledScores[i] as ObjectType,
      position: (i + 0.5) / OBJECTS_PER_TRACK, // 均勻分佈位置
      score: shuffledScores[i],
      hitProbability: calculateHitProbability(shuffledScores[i])
    });
  }
  
  return objects;
}

function calculateHitProbability(score: number): number {
  // 高分物件較難撞到
  const baseProbability = {
    1: 0.8,  // 1分物件 80% 撞擊率
    2: 0.6,  // 2分物件 60% 撞擊率  
    3: 0.4   // 3分物件 40% 撞擊率
  };
  return baseProbability[score] || 0.5;
}
```

## ⚡ 物理引擎機制

### 珠子掉落模擬
```typescript
interface Ball {
  tunnelId: number;
  position: number;        // 當前位置 (0-1，0為頂部)
  velocity: number;        // 下落速度
  score: number;           // 累積分數
  collisionHistory: CollisionEvent[];
}

interface CollisionEvent {
  objectType: ObjectType;
  position: number;
  scoreGained: number;
  timestamp: number;
}
```

### 碰撞檢測算法
```typescript
function simulateBallDrop(
  ball: Ball,
  trackObjects: ScoreObject[],
  collisionFactor: number
): Ball {
  const result = { ...ball };
  
  // 模擬掉落過程
  while (result.position < 1.0) {
    // 更新位置
    result.position += 0.1; // 每步移動0.1
    
    // 檢查碰撞
    const nearbyObjects = trackObjects.filter(obj => 
      Math.abs(obj.position - result.position) < 0.05
    );
    
    for (const obj of nearbyObjects) {
      // 計算撞擊概率（加入隨機因子）
      const hitChance = obj.hitProbability * collisionFactor;
      const randomRoll = Math.random();
      
      if (randomRoll < hitChance) {
        // 發生碰撞
        result.score += obj.score;
        result.collisionHistory.push({
          objectType: obj.type,
          position: obj.position,
          scoreGained: obj.score,
          timestamp: Date.now()
        });
      }
    }
  }
  
  return result;
}
```

## 🏆 勝負判定機制

### 排名計算
```typescript
interface GameResult {
  playerTunnel: number;
  opponentTunnels: number[];
  finalScores: Map<number, number>;  // 軌道 -> 最終分數
  ranking: TunnelRank[];             // 排名列表
  playerWin: boolean;
  winningScore: number;
}

interface TunnelRank {
  tunnel: number;
  score: number;
  rank: number;        // 排名 (1為最高)
  isPlayer: boolean;
}

function calculateGameResult(
  ballResults: Map<number, Ball>
): GameResult {
  // 提取各軌道最終分數
  const finalScores = new Map<number, number>();
  ballResults.forEach((ball, tunnel) => {
    finalScores.set(tunnel, ball.score);
  });
  
  // 建立排名
  const sortedScores = Array.from(finalScores.entries())
    .sort(([,scoreA], [,scoreB]) => scoreB - scoreA);
  
  const ranking: TunnelRank[] = sortedScores.map(([tunnel, score], index) => ({
    tunnel,
    score,
    rank: index + 1,
    isPlayer: tunnel === playerTunnel
  }));
  
  // 判定玩家是否獲勝（最高分或並列最高分）
  const winningScore = ranking[0].score;
  const playerScore = finalScores.get(playerTunnel) || 0;
  const playerWin = playerScore === winningScore;
  
  return {
    finalScores,
    ranking,
    playerWin,
    winningScore
  };
}
```

## 💰 賠率計算系統

### 基礎賠率公式
```typescript
function calculateOdds(opponentCount: number): number {
  const baseOdds = {
    1: 1.80,  // 1 vs 1，50% 勝率
    2: 2.50,  // 1 vs 2，33.3% 勝率  
    3: 3.20,  // 1 vs 3，25% 勝率
    4: 4.00,  // 1 vs 4，20% 勝率
    5: 5.50   // 1 vs 5，16.7% 勝率
  };
  
  const houseEdge = 0.95; // 5% 抽水
  return baseOdds[opponentCount] * houseEdge;
}

function calculatePayout(
  betAmount: number,
  opponentCount: number,
  playerWin: boolean
): number {
  if (!playerWin) return 0;
  
  const odds = calculateOdds(opponentCount);
  return betAmount * odds;
}
```

### 動態賠率調整 (可選)
```typescript
function adjustOddsBasedOnPool(
  baseOdds: number,
  totalBetPool: number,
  playerBetRatio: number
): number {
  // 根據投注池調整賠率
  const adjustmentFactor = 1 - (playerBetRatio - 0.5) * 0.1;
  return Math.max(1.1, baseOdds * adjustmentFactor);
}
```

## 🎮 遊戲狀態管理

### 遊戲狀態定義
```typescript
enum GamePhase {
  BETTING = 'betting',           // 投注階段
  PREPARATION = 'preparation',   // 準備階段  
  PLAYING = 'playing',          // 遊戲進行
  SETTLEMENT = 'settlement'      // 結算階段
}

interface GameState {
  phase: GamePhase;
  timeRemaining: number;
  playerTunnel?: number;
  opponentCount?: number;
  betAmount?: number;
  currentOdds?: number;
  ballStates?: Map<number, Ball>;
  gameResult?: GameResult;
}
```

### 狀態轉換管理
```typescript
class GameStateManager {
  private state: GameState = {
    phase: GamePhase.BETTING,
    timeRemaining: 25
  };
  
  updateBetting(tunnel: number, opponents: number, amount: number) {
    if (this.state.phase !== GamePhase.BETTING) return false;
    
    this.state.playerTunnel = tunnel;
    this.state.opponentCount = opponents;
    this.state.betAmount = amount;
    this.state.currentOdds = calculateOdds(opponents);
    
    return true;
  }
  
  startGame(randomSeed: string) {
    if (this.state.phase !== GamePhase.BETTING) return false;
    
    this.state.phase = GamePhase.PREPARATION;
    this.state.timeRemaining = 3;
    
    // 生成遊戲內容
    this.generateGameContent(randomSeed);
    
    return true;
  }
  
  private generateGameContent(randomSeed: string) {
    const randomNumbers = parseRandomSeed(randomSeed);
    
    // 分配對手軌道
    const opponentTunnels = allocateOpponentTunnels(
      this.state.playerTunnel!,
      this.state.opponentCount!,
      randomNumbers.slice(0, 5)
    );
    
    // 生成各軌道物件
    const allTunnels = [this.state.playerTunnel!, ...opponentTunnels];
    const trackObjects = new Map<number, ScoreObject[]>();
    
    allTunnels.forEach((tunnel, index) => {
      trackObjects.set(
        tunnel,
        generateTrackObjects(tunnel, randomNumbers[5 + index])
      );
    });
    
    // 初始化珠子狀態
    this.state.ballStates = new Map();
    allTunnels.forEach(tunnel => {
      this.state.ballStates!.set(tunnel, {
        tunnelId: tunnel,
        position: 0,
        velocity: 1,
        score: 0,
        collisionHistory: []
      });
    });
  }
}
```

## 📊 遊戲平衡機制

### 長期勝率控制
```typescript
interface BalanceConfig {
  targetWinRate: number;      // 目標勝率
  maxConsecutiveWins: number; // 最大連勝次數
  adjustmentFactor: number;   // 調整系數
}

function applyBalanceAdjustment(
  baseRandomNumbers: number[],
  playerHistory: GameHistory,
  balanceConfig: BalanceConfig
): number[] {
  const recentWinRate = calculateRecentWinRate(playerHistory, 20);
  const consecutiveWins = getConsecutiveWins(playerHistory);
  
  // 如果勝率過高或連勝過多，微調隨機數
  if (recentWinRate > balanceConfig.targetWinRate * 1.2 || 
      consecutiveWins >= balanceConfig.maxConsecutiveWins) {
    
    return baseRandomNumbers.map(num => 
      (num * balanceConfig.adjustmentFactor) % 256
    );
  }
  
  return baseRandomNumbers;
}
```

### 防作弊機制
```typescript
interface AnticheatSystem {
  detectSuspiciousPatterns(playerHistory: GameHistory): boolean;
  validateBetTiming(betTime: number, phaseStartTime: number): boolean;
  checkRapidBetting(betInterval: number[]): boolean;
}

function validateGameIntegrity(
  gameInput: GameInput,
  anticheat: AnticheatSystem
): boolean {
  // 檢查投注時機
  if (!anticheat.validateBetTiming(gameInput.betTime, gameInput.phaseStart)) {
    return false;
  }
  
  // 檢查異常模式
  if (anticheat.detectSuspiciousPatterns(gameInput.playerHistory)) {
    return false;
  }
  
  return true;
}
```

## 🔍 可驗證公平性

### Provably Fair 實現
```typescript
interface ProofData {
  serverSeed: string;        // 服務器種子
  clientSeed: string;        // 客戶端種子  
  nonce: number;            // 局數編號
  finalHash: string;        // 最終哈希值
}

function generateProvablyFairResult(proof: ProofData): number[] {
  const combinedSeed = `${proof.serverSeed}:${proof.clientSeed}:${proof.nonce}`;
  const hash = sha256(combinedSeed);
  
  // 將哈希值轉換為隨機數組
  return hashToRandomNumbers(hash, REQUIRED_RANDOM_COUNT);
}

function verifyGameResult(
  gameResult: GameResult,
  proof: ProofData
): boolean {
  // 重新計算隨機數
  const verifyNumbers = generateProvablyFairResult(proof);
  
  // 重新模擬遊戲
  const verifyResult = simulateGame(
    gameResult.playerTunnel,
    gameResult.opponentTunnels.length,
    verifyNumbers
  );
  
  // 比較結果
  return JSON.stringify(verifyResult) === JSON.stringify(gameResult);
}
```

---

## 🔧 實現注意事項

### 性能優化
- **珠子模擬**: 使用簡化物理計算，避免複雜碰撞檢測
- **動畫優化**: 預計算軌跡，使用補間動畫
- **內存管理**: 及時清理遊戲歷史數據
- **網絡優化**: 壓縮遊戲狀態數據

### 錯誤處理
- **網絡中斷**: 保存遊戲狀態，支援斷線重連
- **計算錯誤**: 多重驗證機制
- **時序問題**: 服務器時間為準
- **異常投注**: 自動取消並退款

### 測試策略
- **單元測試**: 各個算法模塊
- **整合測試**: 完整遊戲流程
- **壓力測試**: 高並發場景
- **公平性測試**: 大量局數統計驗證

---

*此機制文件將隨著開發測試持續優化*
