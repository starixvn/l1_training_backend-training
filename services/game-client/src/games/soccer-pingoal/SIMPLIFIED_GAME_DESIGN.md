# Soccer PinGoal - 簡化版遊戲設計規則

## 🎮 核心概念更新

### 遊戲機制簡化
- ❌ **移除**：複雜物理引擎、實時碰撞檢測、分數累積模擬
- ✅ **保留**：軌道選擇、對手數量、賠率系統、勝負判定
- 🎬 **新增**：預錄影片系統、影片URL映射

### 遊戲流程
1. **玩家選擇** → 軌道(1-6) + 對手數量(1-5) + 投注金額
2. **服務器計算** → 根據ODDS機率決定輸贏
3. **影片選擇** → 根據配置和結果選擇對應影片
4. **客戶端播放** → 播放預錄影片，顯示結果

## 📊 賠率與機率系統

### 賠率表（保持不變）
| 對手數量 | 賠率 | 理論勝率 | 實際勝率調整 |
|---------|------|----------|-------------|
| 1個對手 | 1.8x | 50.0%    | 48.0% |
| 2個對手 | 2.5x | 33.3%    | 32.0% |
| 3個對手 | 3.2x | 25.0%    | 24.0% |
| 4個對手 | 4.0x | 20.0%    | 19.0% |
| 5個對手 | 5.5x | 16.7%    | 15.5% |

*實際勝率略低於理論值，確保平台盈利*

### 勝負判定邏輯
```typescript
function determinePlayerWin(
  opponentCount: number,
  randomValue: number // 0-1 之間的隨機數
): boolean {
  const winProbability = getWinProbability(opponentCount);
  return randomValue < winProbability;
}

const winProbabilities = {
  1: 0.48,  // 48% 勝率
  2: 0.32,  // 32% 勝率
  3: 0.24,  // 24% 勝率
  4: 0.19,  // 19% 勝率
  5: 0.155  // 15.5% 勝率
};
```

## 🎬 影片系統設計

### 影片命名規則
```
格式: T{軌道}_O{對手數}_{結果}.mp4

範例:
- T1_O1_WIN.mp4    (軌道1, 1個對手, 玩家獲勝)
- T1_O1_LOSS.mp4   (軌道1, 1個對手, 玩家失敗)
- T6_O5_WIN.mp4    (軌道6, 5個對手, 玩家獲勝)
- T6_O5_LOSS.mp4   (軌道6, 5個對手, 玩家失敗)
```

### 影片文件結構
```
/static/videos/tunnel-game/
├── T1/
│   ├── T1_O1_WIN.mp4
│   ├── T1_O1_LOSS.mp4
│   ├── T1_O2_WIN.mp4
│   ├── T1_O2_LOSS.mp4
│   ├── T1_O3_WIN.mp4
│   ├── T1_O3_LOSS.mp4
│   ├── T1_O4_WIN.mp4
│   ├── T1_O4_LOSS.mp4
│   ├── T1_O5_WIN.mp4
│   └── T1_O5_LOSS.mp4
├── T2/
│   └── ... (同樣的10個影片)
├── T3/
│   └── ... (同樣的10個影片)
├── T4/
│   └── ... (同樣的10個影片)
├── T5/
│   └── ... (同樣的10個影片)
└── T6/
    └── ... (同樣的10個影片)

總計: 6 軌道 × 5 對手數 × 2 結果 = 60 個影片檔案
```

### 影片URL生成邏輯
```typescript
interface VideoRequest {
  playerTunnel: number;    // 1-6
  opponentCount: number;   // 1-5
  playerWin: boolean;      // true/false
}

function generateVideoUrl(request: VideoRequest): string {
  const { playerTunnel, opponentCount, playerWin } = request;
  const result = playerWin ? 'WIN' : 'LOSS';
  const filename = `T${playerTunnel}_O${opponentCount}_${result}.mp4`;
  
  return `${VIDEO_BASE_URL}/tunnel-game/T${playerTunnel}/${filename}`;
}

// 範例
const videoUrl = generateVideoUrl({
  playerTunnel: 6,
  opponentCount: 3, 
  playerWin: true
});
// 結果: "/static/videos/tunnel-game/T6/T6_O3_WIN.mp4"
```

## 🔧 技術實現

### 後端 result-helper.ts 簡化版
```typescript
import { TUNNEL_COUNT, MAX_OPPONENTS } from "../constants";

interface TunnelGameResult {
  playerTunnel: number;
  opponentCount: number;
  playerWin: boolean;
  videoUrl: string;
  winAmount: number;
}

const WIN_PROBABILITIES = {
  1: 0.48,
  2: 0.32, 
  3: 0.24,
  4: 0.19,
  5: 0.155
};

const ODDS_TABLE = {
  1: 1.8,
  2: 2.5,
  3: 3.2,
  4: 4.0,
  5: 5.5
};

export const generateResult = ({ 
  finalHash, 
  serverSeed,
  playerTunnel,
  opponentCount,
  betAmount 
}: {
  finalHash: string;
  serverSeed: string;
  playerTunnel: number;
  opponentCount: number;
  betAmount: number;
}): TunnelGameResult => {
  
  // 生成單一隨機數 (0-1)
  const randomValue = generateSingleRandom(finalHash, serverSeed);
  
  // 判定勝負
  const winProbability = WIN_PROBABILITIES[opponentCount];
  const playerWin = randomValue < winProbability;
  
  // 計算獎金
  const winAmount = playerWin ? betAmount * ODDS_TABLE[opponentCount] : 0;
  
  // 生成影片URL
  const videoUrl = generateVideoUrl({
    playerTunnel,
    opponentCount,
    playerWin
  });
  
  return {
    playerTunnel,
    opponentCount,
    playerWin,
    videoUrl,
    winAmount
  };
};

function generateSingleRandom(finalHash: string, serverSeed: string): number {
  // 簡化的隨機數生成，只需要一個0-1的隨機值
  const combined = finalHash + serverSeed;
  const hash = sha256(combined);
  const randomInt = parseInt(hash.substring(0, 8), 16);
  return randomInt / 0xFFFFFFFF; // 轉換為0-1之間的小數
}

export const getSettlementResult = (roundResult: TunnelGameResult) => {
  return {
    playerWin: roundResult.playerWin,
    winAmount: roundResult.winAmount,
    videoUrl: roundResult.videoUrl
  };
};
```

### 前端影片播放組件
```typescript
interface VideoPlayerProps {
  videoUrl: string;
  onVideoEnd: () => void;
  playerTunnel: number;
  opponentCount: number;
}

export const TunnelGameVideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  onVideoEnd,
  playerTunnel,
  opponentCount
}) => {
  return (
    <div className="tunnel-game-video">
      <video
        src={videoUrl}
        autoPlay
        muted
        onEnded={onVideoEnd}
        className="game-video"
      />
      
      <div className="video-overlay">
        <div className="player-info">
          Your Tunnel: {playerTunnel}
        </div>
        <div className="opponent-info">
          Opponents: {opponentCount}
        </div>
      </div>
    </div>
  );
};
```

## 📝 遊戲常數更新

### constants.ts 簡化版
```typescript
export const TUNNEL_COUNT = 6;
export const MAX_OPPONENTS = 5;
export const MIN_OPPONENTS = 1;

// 移除物理相關常數
// export const OBJECTS_PER_TRACK = 10;
// export const OBJECT_TYPES = {...};
// export const REQUIRED_RANDOM_COUNT = 14;

// 新增影片相關常數
export const VIDEO_BASE_URL = "/static/videos";
export const VIDEO_DURATION = 5000; // 5秒影片
export const REQUIRED_RANDOM_COUNT = 1; // 只需要1個隨機數

export const WIN_PROBABILITIES = {
  1: 0.48,
  2: 0.32,
  3: 0.24,
  4: 0.19,
  5: 0.155
};

export const ODDS_TABLE = {
  1: 1.8,
  2: 2.5,
  3: 3.2,
  4: 4.0,
  5: 5.5
};
```

### game-settings.ts 更新
```typescript
export default {
  id: 200,
  name: "SoccerPinGoal",
  durations: {
    wholeRound: 35,
    placingBets: 25,
    preparation: 3,
    videoPlaying: 5,    // 影片播放時間
    settlement: 2,
  },
  choices: ['tunnel1', 'tunnel2', 'tunnel3', 'tunnel4', 'tunnel5', 'tunnel6',
            'opponent1', 'opponent2', 'opponent3', 'opponent4', 'opponent5'],
  choicesMapper: { 
    tunnel1: 1, tunnel2: 2, tunnel3: 3, 
    tunnel4: 4, tunnel5: 5, tunnel6: 6,
    opponent1: 1, opponent2: 2, opponent3: 3,
    opponent4: 4, opponent5: 5
  },
  hedgeBetGroups: [], 
  oddsTable: ODDS_TABLE,
  winProbabilities: WIN_PROBABILITIES,
  videoSettings: {
    baseUrl: VIDEO_BASE_URL,
    duration: VIDEO_DURATION,
    format: 'mp4'
  },
  // 移除物理引擎相關設定
  numberOfRoundHistory: 100,
  historyPageSize: 10,
  provablyFair: true,
};
```

## 🎯 客戶端狀態管理

### 遊戲狀態簡化
```typescript
interface TunnelGameState {
  // 保留的狀態
  selectedTunnel?: number;
  selectedOpponents?: number;
  currentOdds?: number;
  betAmount?: number;
  
  // 新增的狀態
  isVideoPlaying: boolean;
  currentVideoUrl?: string;
  gameResult?: TunnelGameResult;
  
  // 移除的狀態
  // ballAnimations?: BallAnimation[];
  // tunnelScores?: Map<number, number>;
  // physicsState?: PhysicsState;
}

// 簡化的遊戲階段
enum GamePhase {
  BETTING = 'betting',
  PREPARATION = 'preparation',
  VIDEO_PLAYING = 'video_playing',
  SETTLEMENT = 'settlement'
}
```

### WebSocket 事件更新
```typescript
interface TunnelGameEvents {
  // 保留的事件
  'tunnel-selected': { tunnel: number };
  'opponents-selected': { count: number };
  'game-start': { playerTunnel: number, opponentCount: number, betAmount: number };
  
  // 新增的事件  
  'video-ready': { videoUrl: string };
  'game-result': { result: TunnelGameResult };
  
  // 移除的事件
  // 'ball-drop-start': { tunnelAssignments: TunnelAssignment[] };
  // 'ball-collision': { tunnelId: number, score: number, position: number };
}
```

## 💾 影片管理系統

### 影片預加載策略
```typescript
class VideoPreloader {
  private videoCache = new Map<string, HTMLVideoElement>();
  
  // 預加載常用影片
  preloadCommonVideos() {
    const commonConfigs = [
      { tunnel: 1, opponents: 1 },
      { tunnel: 6, opponents: 5 },
      // ... 其他熱門配置
    ];
    
    commonConfigs.forEach(config => {
      this.preloadVideo(config.tunnel, config.opponents, true);
      this.preloadVideo(config.tunnel, config.opponents, false);
    });
  }
  
  private preloadVideo(tunnel: number, opponents: number, win: boolean) {
    const url = generateVideoUrl({ 
      playerTunnel: tunnel, 
      opponentCount: opponents, 
      playerWin: win 
    });
    
    const video = document.createElement('video');
    video.src = url;
    video.preload = 'metadata';
    
    this.videoCache.set(url, video);
  }
}
```

### 影片品質管理
```typescript
// 根據網絡狀況選擇影片品質
interface VideoQuality {
  quality: 'high' | 'medium' | 'low';
  resolution: string;
  bitrate: string;
}

const VIDEO_QUALITIES = {
  high: { resolution: '1920x1080', bitrate: '2000k' },
  medium: { resolution: '1280x720', bitrate: '1000k' }, 
  low: { resolution: '854x480', bitrate: '500k' }
};

function selectVideoQuality(): VideoQuality {
  const connection = (navigator as any).connection;
  if (!connection) return VIDEO_QUALITIES.medium;
  
  if (connection.effectiveType === '4g') return VIDEO_QUALITIES.high;
  if (connection.effectiveType === '3g') return VIDEO_QUALITIES.medium;
  return VIDEO_QUALITIES.low;
}
```

## 📊 數據統計更新

### 簡化的統計指標
```typescript
interface GameStatistics {
  // 移除複雜的物理統計
  // averageCollisions: number;
  // averageScore: number;
  // objectHitRates: Map<number, number>;
  
  // 保留核心統計
  totalGames: number;
  winRate: number;
  favoriteStrategy: { tunnel: number, opponents: number };
  totalWinnings: number;
  
  // 新增影片相關統計
  videoLoadTimes: number[];
  mostWatchedVideos: string[];
  videoQualityPreference: string;
}
```

## 🚀 部署考量

### CDN 影片分發
```typescript
// 影片CDN配置
const VIDEO_CDN_CONFIG = {
  primary: 'https://cdn1.example.com/videos/',
  secondary: 'https://cdn2.example.com/videos/',
  fallback: '/static/videos/' // 本地備用
};

function getOptimalVideoUrl(filename: string): string {
  // 根據用戶地理位置選擇最近的CDN
  const userRegion = detectUserRegion();
  const cdnUrl = selectCDNByRegion(userRegion);
  
  return `${cdnUrl}tunnel-game/${filename}`;
}
```

### 影片壓縮與優化
- **格式**: MP4 (H.264編碼)
- **時長**: 固定5秒
- **分辨率**: 1280x720 (主要) + 854x480 (備用)
- **幀率**: 30fps
- **音頻**: 無音頻軌道（減少文件大小）

---

## 📋 開發任務更新

### Phase 1: 核心邏輯簡化 (3-5天)
- [ ] 移除物理引擎相關代碼
- [ ] 簡化 result-helper.ts
- [ ] 更新遊戲常數和設定
- [ ] 實現影片URL生成邏輯

### Phase 2: 前端組件更新 (5-7天)
- [ ] 移除複雜的軌道場地組件
- [ ] 實現影片播放器組件
- [ ] 更新遊戲狀態管理
- [ ] 簡化UI組件

### Phase 3: 影片系統 (7-10天)
- [ ] 建立影片命名規範
- [ ] 實現影片預加載機制
- [ ] 設定CDN分發
- [ ] 影片品質自適應

### Phase 4: 測試與優化 (3-5天)
- [ ] 端到端測試
- [ ] 影片加載性能測試
- [ ] 網絡適應性測試
- [ ] 文檔更新

**總開發時間**: 約3-4週 (比原計劃減少2-4週)

這個簡化版本大幅降低了技術複雜度，開發時間和維護成本，同時保持了遊戲的核心樂趣！🎉
