# Soccer PinGoal - 技術實作變更計劃

## 📋 需要修改的現有檔案

### 後端服務檔案 (`/services/services/soccer-pingoal-service/`)

#### 1. `src/constants.ts`
```typescript
// 當前內容（需要完全替換）
export const BET_CHOICES = {
    goal: "goal",
    miss: "miss", 
    // ... 其他足球相關選項
};

// 新內容
export const TUNNEL_COUNT = 6;
export const MAX_OPPONENTS = 5;
export const MIN_OPPONENTS = 1;

export const GAME_PHASES = {
    BETTING: 'betting',
    PREPARATION: 'preparation', 
    PLAYING: 'playing',
    SETTLEMENT: 'settlement'
};

export const OBJECT_TYPES = {
    SMALL_GREEN: 1,    // 1分
    MEDIUM_YELLOW: 2,  // 2分
    LARGE_RED: 3       // 3分
};

export const OBJECTS_PER_TRACK = 10;
export const REQUIRED_RANDOM_COUNT = 14;
```

#### 2. `src/game-settings.ts`
```typescript
// 需要更新的內容
export default {
    id: 200,
    name: "SoccerPinGoal", 
    durations: {
        wholeRound: 35,        // 增加到35秒
        placingBets: 25,       // 投注階段25秒
        preparation: 3,        // 準備階段3秒
        playing: 5,            // 遊戲進行5秒
        settlement: 2,         // 結算階段2秒
    },
    choices: ['tunnel1', 'tunnel2', 'tunnel3', 'tunnel4', 'tunnel5', 'tunnel6',
              'opponent1', 'opponent2', 'opponent3', 'opponent4', 'opponent5'],
    choicesMapper: { 
        tunnel1: 1, tunnel2: 2, tunnel3: 3, 
        tunnel4: 4, tunnel5: 5, tunnel6: 6,
        opponent1: 1, opponent2: 2, opponent3: 3,
        opponent4: 4, opponent5: 5
    },
    hedgeBetGroups: [], // 沒有對沖投注組合
    oddsTable: {
        1: 1.80,  // 1個對手的賠率
        2: 2.50,  // 2個對手的賠率  
        3: 3.20,  // 3個對手的賠率
        4: 4.00,  // 4個對手的賠率
        5: 5.50   // 5個對手的賠率
    },
    // ... 其他設定保持不變
};
```

#### 3. `src/helpers/result-helper.ts` (完全重寫)
```typescript
// 需要完全替換為新的邏輯
import { TUNNEL_COUNT, MAX_OPPONENTS, OBJECTS_PER_TRACK } from "../constants";

interface TunnelGameResult {
    playerTunnel: number;           // 玩家軌道
    opponentTunnels: number[];      // 對手軌道  
    tunnelScores: Map<number, number>; // 各軌道分數
    winningTunnel: number;          // 獲勝軌道
    playerWin: boolean;             // 玩家是否獲勝
    playerScore: number;            // 玩家分數
    winningScore: number;           // 最高分數
}

// 軌道分配函數
function allocateOpponentTunnels(
    playerTunnel: number,
    opponentCount: number,
    randomNumbers: number[]
): number[] {
    // 實現軌道分配邏輯
}

// 分數計算函數  
function calculateTunnelScore(
    tunnelId: number,
    randomSeed: number,
    collisionFactor: number
): number {
    // 實現分數計算邏輯
}

export const generateResult = ({ finalHash, serverSeed }: {
    finalHash: string;
    serverSeed: string;
}): TunnelGameResult => {
    // 實現新的遊戲結果生成邏輯
};

export const getSettlementResult = (roundResult: TunnelGameResult) => {
    // 返回玩家是否獲勝的結果
    return {
        playerWin: roundResult.playerWin
    };
};
```

### 前端客戶端檔案 (`/services/game-client/src/games/soccer-pingoal/`)

#### 4. `soccer-multiplayer-constants.ts` (重新命名為 `tunnel-game-constants.ts`)
```typescript
// 完全重寫內容
export const TunnelGameBetOptions = {
    TUNNEL_1: "tunnel1",
    TUNNEL_2: "tunnel2", 
    TUNNEL_3: "tunnel3",
    TUNNEL_4: "tunnel4",
    TUNNEL_5: "tunnel5", 
    TUNNEL_6: "tunnel6"
};

export const OpponentCountOptions = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5
};

export const TunnelColors = {
    1: "#FF6B6B", // 紅色
    2: "#4ECDC4", // 青色  
    3: "#45B7D1", // 藍色
    4: "#96CEB4", // 綠色
    5: "#FFEAA7", // 黃色
    6: "#DDA0DD"  // 紫色
};

export const ObjectColors = {
    [OBJECT_TYPES.SMALL_GREEN]: "#22C55E",   // 綠色 1分
    [OBJECT_TYPES.MEDIUM_YELLOW]: "#EAB308", // 黃色 2分  
    [OBJECT_TYPES.LARGE_RED]: "#DC2626"      // 紅色 3分
};

export const OddsTable = {
    1: 1.80, 2: 2.50, 3: 3.20, 4: 4.00, 5: 5.50
};
```

#### 5. `page.tsx` (主要遊戲組件需要大幅修改)
```typescript
// 需要更新的導入
import { TunnelGameBetOptions, OpponentCountOptions } from "./tunnel-game-constants";

// 需要新增的狀態
export type TunnelGameState = {
    selectedTunnel?: number;        // 選擇的軌道
    selectedOpponents?: number;     // 選擇的對手數
    currentOdds?: number;          // 當前賠率
    gamePhase?: string;            // 遊戲階段
    ballAnimations?: BallAnimation[]; // 珠子動畫狀態
} & GameBaseState;

// 需要新增的方法
private readonly selectTunnel = (tunnelId: number) => {
    this.setState({ selectedTunnel: tunnelId });
    this.updateOdds();
};

private readonly selectOpponents = (count: number) => {
    this.setState({ selectedOpponents: count });
    this.updateOdds();
};

private readonly updateOdds = () => {
    if (this.state.selectedOpponents) {
        const odds = OddsTable[this.state.selectedOpponents];
        this.setState({ currentOdds: odds });
    }
};
```

## 🆕 需要新增的檔案

### 後端新增檔案

#### 1. `src/types/tunnel-game.types.ts`
```typescript
export interface TunnelSelection {
    playerTunnel: number;
    opponentCount: number;
    betAmount: number;
}

export interface TunnelGameResult {
    playerTunnel: number;
    opponentTunnels: number[];
    tunnelScores: Map<number, number>;
    winningTunnel: number;
    playerWin: boolean;
    // ... 其他類型定義
}

export interface BallSimulation {
    tunnelId: number;
    collisionEvents: CollisionEvent[];
    finalScore: number;
}

export interface CollisionEvent {
    position: number;
    objectType: number;
    scoreGained: number;
    timestamp: number;
}
```

#### 2. `src/helpers/tunnel-allocation.helper.ts`
```typescript
export class TunnelAllocationHelper {
    static allocateOpponentTunnels(
        playerTunnel: number,
        opponentCount: number,
        randomNumbers: number[]
    ): number[] {
        // 軌道分配邏輯
    }
    
    static validateTunnelSelection(
        tunnel: number,
        opponentCount: number
    ): boolean {
        // 選擇驗證邏輯
    }
}
```

#### 3. `src/helpers/physics-simulation.helper.ts`
```typescript
export class PhysicsSimulationHelper {
    static simulateBallDrop(
        tunnelId: number,
        randomSeed: number,
        collisionFactor: number
    ): BallSimulation {
        // 物理模擬邏輯
    }
    
    static generateTrackObjects(
        tunnelId: number,
        randomSeed: number
    ): ScoreObject[] {
        // 軌道物件生成
    }
}
```

### 前端新增檔案

#### 4. `components/tunnel-selector.tsx`
```typescript
interface TunnelSelectorProps {
    selectedTunnel?: number;
    onTunnelSelect: (tunnel: number) => void;
    disabled?: boolean;
}

export const TunnelSelector: React.FC<TunnelSelectorProps> = ({
    selectedTunnel,
    onTunnelSelect,
    disabled = false
}) => {
    return (
        <div className="tunnel-selector">
            {[1,2,3,4,5,6].map(tunnel => (
                <button
                    key={tunnel}
                    className={`tunnel-button ${selectedTunnel === tunnel ? 'selected' : ''}`}
                    onClick={() => onTunnelSelect(tunnel)}
                    disabled={disabled}
                    style={{ backgroundColor: TunnelColors[tunnel] }}
                >
                    {tunnel}
                </button>
            ))}
        </div>
    );
};
```

#### 5. `components/opponent-counter.tsx`
```typescript
interface OpponentCounterProps {
    selectedCount?: number;
    onCountSelect: (count: number) => void;
    disabled?: boolean;
}

export const OpponentCounter: React.FC<OpponentCounterProps> = ({
    selectedCount,
    onCountSelect, 
    disabled = false
}) => {
    return (
        <div className="opponent-counter">
            <h3>NUMBER OF OPPONENTS</h3>
            <div className="count-buttons">
                {[1,2,3,4,5].map(count => (
                    <button
                        key={count}
                        className={`count-button ${selectedCount === count ? 'selected' : ''}`}
                        onClick={() => onCountSelect(count)}
                        disabled={disabled}
                    >
                        {count}
                    </button>
                ))}
            </div>
        </div>
    );
};
```

#### 6. `components/tunnel-game-field.tsx`
```typescript
interface TunnelGameFieldProps {
    tunnels: TunnelData[];
    ballAnimations: BallAnimation[];
    gamePhase: string;
}

export const TunnelGameField: React.FC<TunnelGameFieldProps> = ({
    tunnels,
    ballAnimations,
    gamePhase
}) => {
    return (
        <div className="tunnel-game-field">
            <div className="tunnels-container">
                {tunnels.map(tunnel => (
                    <TunnelColumn 
                        key={tunnel.id}
                        tunnel={tunnel}
                        animation={ballAnimations.find(a => a.tunnelId === tunnel.id)}
                        gamePhase={gamePhase}
                    />
                ))}
            </div>
        </div>
    );
};
```

#### 7. `components/tunnel-column.tsx`
```typescript
interface TunnelColumnProps {
    tunnel: TunnelData;
    animation?: BallAnimation;
    gamePhase: string;
}

export const TunnelColumn: React.FC<TunnelColumnProps> = ({
    tunnel,
    animation,
    gamePhase
}) => {
    return (
        <div className="tunnel-column" style={{ backgroundColor: TunnelColors[tunnel.id] }}>
            <div className="tunnel-header">
                <span className="tunnel-number">{tunnel.id}</span>
            </div>
            
            <div className="tunnel-track">
                {tunnel.objects.map((obj, index) => (
                    <ScoreObject 
                        key={index}
                        type={obj.type}
                        position={obj.position}
                        hit={animation?.hitObjects.includes(index)}
                    />
                ))}
                
                {animation && (
                    <Ball 
                        position={animation.ballPosition}
                        isPlayer={tunnel.isPlayer}
                        phase={gamePhase}
                    />
                )}
            </div>
            
            <div className="tunnel-footer">
                <span className="tunnel-score">{tunnel.currentScore || 0}</span>
            </div>
        </div>
    );
};
```

#### 8. `components/odds-display.tsx`
```typescript
interface OddsDisplayProps {
    selectedOpponents?: number;
    betAmount?: number;
    potentialWin?: number;
}

export const OddsDisplay: React.FC<OddsDisplayProps> = ({
    selectedOpponents,
    betAmount,
    potentialWin
}) => {
    const currentOdds = selectedOpponents ? OddsTable[selectedOpponents] : 0;
    
    return (
        <div className="odds-display">
            <div className="odds-section">
                <span className="label">ODDS</span>
                <span className="value">{currentOdds.toFixed(2)}</span>
            </div>
            
            <div className="payout-section">
                <span className="label">PAYOUT</span>
                <span className="value">${potentialWin?.toFixed(2) || '0.00'}</span>
            </div>
        </div>
    );
};
```

## 🎨 需要新增的樣式檔案

#### 9. `styles/tunnel-game.module.scss`
```scss
.tunnel-game-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.game-header {
  padding: 20px;
  text-align: center;
  color: white;
  
  .game-title {
    font-size: 2rem;
    margin-bottom: 10px;
  }
  
  .balance-display {
    background: #ff9500;
    padding: 10px 20px;
    border-radius: 25px;
    display: inline-block;
  }
}

.tunnel-selector {
  display: flex;
  gap: 10px;
  justify-content: center;
  padding: 20px;
  background: #4ECDC4;
  border-radius: 15px;
  margin: 10px;
  
  .tunnel-button {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    border: 3px solid transparent;
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.selected {
      border-color: white;
      transform: scale(1.1);
    }
    
    &:hover:not(:disabled) {
      transform: scale(1.05);
    }
  }
}

.opponent-counter {
  background: #2c3e50;
  padding: 20px;
  margin: 10px;
  border-radius: 15px;
  text-align: center;
  
  h3 {
    color: white;
    margin-bottom: 15px;
  }
  
  .count-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
    
    .count-button {
      width: 50px;
      height: 50px;
      border-radius: 25px;
      border: 2px solid #3498db;
      background: #3498db;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &.selected {
        background: #e74c3c;
        border-color: #e74c3c;
      }
      
      &:hover:not(:disabled) {
        transform: scale(1.1);
      }
    }
  }
}

.tunnel-game-field {
  flex: 1;
  padding: 20px;
  
  .tunnels-container {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    height: 400px;
  }
}

.tunnel-column {
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  
  .tunnel-header {
    text-align: center;
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
  
  .tunnel-track {
    flex: 1;
    position: relative;
    background: rgba(255,255,255,0.2);
    border-radius: 5px;
  }
  
  .tunnel-footer {
    text-align: center;
    color: white;
    font-weight: bold;
    font-size: 1.1rem;
    margin-top: 10px;
    
    .tunnel-score {
      background: rgba(0,0,0,0.3);
      padding: 5px 10px;
      border-radius: 15px;
    }
  }
}
```

## 🔄 遊戲流程變更

### 新的遊戲階段管理
```typescript
// 需要在 GameStateHandler 中新增
enum TunnelGamePhase {
    BETTING = 'betting',       // 25秒：選擇軌道和對手數量
    PREPARATION = 'preparation', // 3秒：分配對手軌道，顯示準備畫面
    PLAYING = 'playing',       // 5秒：珠子掉落動畫
    SETTLEMENT = 'settlement'   // 2秒：顯示結果和派彩
}
```

### WebSocket 事件更新
```typescript
// 需要新增的事件類型
interface TunnelGameEvents {
    'tunnel-selected': { tunnel: number };
    'opponents-selected': { count: number };
    'game-start': { playerTunnel: number, opponentCount: number };
    'ball-drop-start': { tunnelAssignments: TunnelAssignment[] };
    'ball-collision': { tunnelId: number, score: number, position: number };
    'game-result': { result: TunnelGameResult };
}
```

## 📱 移動端適配變更

### 響應式佈局調整
```scss
// 手機版樣式調整
@media (max-width: 768px) {
  .tunnel-game-field {
    .tunnels-container {
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 5px;
      height: 300px;
    }
  }
  
  .tunnel-selector {
    .tunnel-button {
      width: 45px;
      height: 45px;
      font-size: 1.2rem;
    }
  }
  
  .opponent-counter {
    .count-buttons {
      .count-button {
        width: 40px;
        height: 40px;
        font-size: 1rem;
      }
    }
  }
}
```

## 🗂️ 檔案重新命名清單

1. `sedie-multiplayer-constants.ts` → `tunnel-game-constants.ts`
2. `sedie-multiplayer-game-round-data-handler.ts` → `tunnel-game-round-data-handler.ts`
3. `sedie-multiplayer-betting-block.tsx` → `tunnel-game-betting-block.tsx`
4. `sedie-plate.tsx` → `tunnel-game-field.tsx`
5. `sedie-buttons.tsx` → `tunnel-selector.tsx`

## ⚙️ 配置檔案變更

### Docker 配置無需變更
現有的 Docker 配置已經支援新的遊戲服務，無需修改。

### 環境變數新增
```bash
# 新增遊戲特定配置
TUNNEL_GAME_OBJECT_DENSITY=10
TUNNEL_GAME_PHYSICS_SPEED=1.0
TUNNEL_GAME_ANIMATION_DURATION=5000
TUNNEL_GAME_MAX_BET_AMOUNT=1000
```

---

## 🚀 實施順序建議

### Phase 1: 後端核心邏輯 (1-2週)
1. 更新 `constants.ts` 和 `game-settings.ts`
2. 重寫 `result-helper.ts` 
3. 新增軌道分配和物理模擬輔助類
4. 測試隨機數生成和遊戲結果

### Phase 2: 前端基礎組件 (1-2週)  
1. 創建軌道選擇器和對手計數器組件
2. 更新主遊戲頁面邏輯
3. 實現基本的投注介面
4. 整合賠率顯示系統

### Phase 3: 視覺效果和動畫 (2-3週)
1. 實現軌道遊戲場地組件
2. 開發珠子掉落動畫
3. 添加碰撞效果和分數動畫
4. 優化移動端體驗

### Phase 4: 測試和優化 (1週)
1. 端到端測試
2. 性能優化
3. 錯誤處理完善
4. 文檔更新

---

*此技術變更計劃將隨開發進度調整*
