# Soccer PinGoal - 簡化版遊戲機制設計

## 🎮 核心設計原則

### ❌ 移除的複雜機制
- **物理引擎**: 不再需要實時碰撞檢測
- **分數累積**: 不需要計算珠子撞擊分數
- **軌道物件**: 不需要生成隨機物件分佈
- **多隨機數**: 不需要14個隨機數控制

### ✅ 保留的核心機制
- **軌道選擇**: 玩家選擇1-6軌道
- **對手數量**: 選擇1-5個對手
- **賠率系統**: 根據對手數量調整賠率
- **公平驗證**: Provably Fair 系統

### 🎬 新增的影片機制
- **預錄影片**: 所有遊戲過程預先錄製
- **URL映射**: 根據配置和結果選擇對應影片
- **CDN分發**: 高效的影片內容分發

## 🎲 簡化的隨機數系統

### 單一隨機數生成
```typescript
// 原本需要14個隨機數，現在只需要1個
const REQUIRED_RANDOM_COUNT = 1;

function generateSingleRandom(finalHash: string, serverSeed: string): number {
  const combinedSeed = `${serverSeed}:${finalHash}`;
  const hash = sha256(combinedSeed);
  const randomInt = parseInt(hash.substring(0, 8), 16);
  return randomInt / 0xFFFFFFFF; // 轉換為0-1之間的小數
}
```

### 勝負判定邏輯
```typescript
const WIN_PROBABILITIES = {
  1: 0.48,   // 1個對手 - 48% 勝率（略低於50%確保平台盈利）
  2: 0.32,   // 2個對手 - 32% 勝率
  3: 0.24,   // 3個對手 - 24% 勝率  
  4: 0.19,   // 4個對手 - 19% 勝率
  5: 0.155   // 5個對手 - 15.5% 勝率
};

function determineWinner(opponentCount: number, randomValue: number): boolean {
  const winProbability = WIN_PROBABILITIES[opponentCount];
  return randomValue < winProbability;
}
```

## 🎬 影片系統架構

### 影片命名標準
```
格式: T{軌道}_O{對手數}_{結果}.mp4

完整範例:
├── T1_O1_WIN.mp4     (軌道1, 1個對手, 玩家獲勝)
├── T1_O1_LOSS.mp4    (軌道1, 1個對手, 玩家失敗)
├── T1_O2_WIN.mp4     (軌道1, 2個對手, 玩家獲勝)
├── T1_O2_LOSS.mp4    (軌道1, 2個對手, 玩家失敗)
└── ... (共60個影片檔案)

計算: 6軌道 × 5對手數 × 2結果 = 60個影片
```

### 影片URL生成演算法
```typescript
interface VideoConfig {
  playerTunnel: number;    // 1-6
  opponentCount: number;   // 1-5 
  playerWin: boolean;      // true/false
}

function generateVideoUrl(config: VideoConfig): string {
  const { playerTunnel, opponentCount, playerWin } = config;
  const result = playerWin ? 'WIN' : 'LOSS';
  const filename = `T${playerTunnel}_O${opponentCount}_${result}.mp4`;
  
  return `${VIDEO_BASE_URL}/T${playerTunnel}/${filename}`;
}

// 範例使用
const url = generateVideoUrl({
  playerTunnel: 6,
  opponentCount: 3,
  playerWin: true
});
// 結果: "/static/videos/tunnel-game/T6/T6_O3_WIN.mp4"
```

### 影片目錄結構
```
/static/videos/tunnel-game/
├── T1/                 # 軌道1的所有影片
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
├── T2/                 # 軌道2的所有影片
│   └── ... (10個影片)
├── T3/                 # 軌道3的所有影片
│   └── ... (10個影片)
├── T4/                 # 軌道4的所有影片
│   └── ... (10個影片)
├── T5/                 # 軌道5的所有影片
│   └── ... (10個影片)
└── T6/                 # 軌道6的所有影片
    └── ... (10個影片)
```

## ⚖️ 賠率與機率平衡

### 理論 vs 實際勝率
| 對手數 | 理論勝率 | 實際勝率 | 賠率 | RTP | 平台優勢 |
|--------|----------|----------|------|-----|-----------|
| 1個對手 | 50.0% | 48.0% | 1.8x | 86.4% | 13.6% |
| 2個對手 | 33.3% | 32.0% | 2.5x | 80.0% | 20.0% |
| 3個對手 | 25.0% | 24.0% | 3.2x | 76.8% | 23.2% |
| 4個對手 | 20.0% | 19.0% | 4.0x | 76.0% | 24.0% |
| 5個對手 | 16.7% | 15.5% | 5.5x | 85.3% | 14.7% |

### RTP計算公式
```typescript
function calculateRTP(opponentCount: number): number {
  const winProbability = WIN_PROBABILITIES[opponentCount];
  const odds = ODDS_TABLE[opponentCount];
  
  // RTP = 勝率 × 賠率 + 敗率 × 0
  return winProbability * odds;
}

// 範例計算
const rtp1 = calculateRTP(1); // 0.48 × 1.8 = 86.4%
const rtp5 = calculateRTP(5); // 0.155 × 5.5 = 85.3%
```

## 🔧 技術實現簡化

### 後端邏輯大幅簡化
```typescript
// 之前: 複雜的物理模擬 (500+ 行代碼)
class PhysicsEngine {
  simulateBallDrop() { /* 複雜的碰撞計算 */ }
  calculateCollisions() { /* 多重物件碰撞 */ }
  updateTrajectory() { /* 軌跡計算 */ }
  // ... 更多複雜邏輯
}

// 現在: 簡單的機率判定 (50行代碼)
function generateResult(input: TunnelGameInput): TunnelGameResult {
  const randomValue = generateSingleRandom(input.finalHash, input.serverSeed);
  const playerWin = randomValue < WIN_PROBABILITIES[input.opponentCount];
  const videoUrl = generateVideoUrl(input.playerTunnel, input.opponentCount, playerWin);
  
  return { playerWin, videoUrl, winAmount: playerWin ? calculateWinAmount(input) : 0 };
}
```

### 前端狀態管理簡化
```typescript
// 之前: 複雜的物理狀態管理
interface ComplexGameState {
  ballPositions: Map<number, Vector3>;
  ballVelocities: Map<number, Vector3>;
  collisionEvents: CollisionEvent[];
  physicsStep: number;
  animationFrame: number;
  // ... 更多複雜狀態
}

// 現在: 簡單的影片狀態管理
interface SimpleGameState {
  selectedTunnel?: number;
  selectedOpponents?: number;
  currentOdds?: number;
  isVideoPlaying: boolean;
  currentVideoUrl?: string;
  gameResult?: TunnelGameResult;
}
```

## 🎥 影片管理系統

### 影片預加載策略
```typescript
class VideoPreloader {
  private cache = new Map<string, HTMLVideoElement>();
  
  // 預加載熱門配置的影片
  async preloadPopularVideos() {
    const popularConfigs = [
      { tunnel: 1, opponents: 1 },  // 最安全的選擇
      { tunnel: 6, opponents: 5 },  // 最高風險選擇
      { tunnel: 3, opponents: 3 },  // 平衡選擇
    ];
    
    for (const config of popularConfigs) {
      await this.preloadVideo(config.tunnel, config.opponents, true);
      await this.preloadVideo(config.tunnel, config.opponents, false);
    }
  }
  
  private async preloadVideo(tunnel: number, opponents: number, win: boolean): Promise<void> {
    const url = generateVideoUrl({ playerTunnel: tunnel, opponentCount: opponents, playerWin: win });
    
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = url;
      video.preload = 'metadata';
      
      video.addEventListener('canplaythrough', () => {
        this.cache.set(url, video);
        resolve();
      });
    });
  }
}
```

### 影片品質自適應
```typescript
interface NetworkQuality {
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g';
  downlink: number;
  rtt: number;
}

function selectVideoQuality(network: NetworkQuality): 'high' | 'medium' | 'low' {
  if (network.effectiveType === '4g' && network.downlink > 2) {
    return 'high';   // 1920x1080, 2000kbps
  } else if (network.effectiveType === '3g' || network.downlink > 0.5) {
    return 'medium'; // 1280x720, 1000kbps
  } else {
    return 'low';    // 854x480, 500kbps
  }
}

// 根據網絡狀況調整影片URL
function getAdaptiveVideoUrl(baseUrl: string, quality: string): string {
  return baseUrl.replace('.mp4', `_${quality}.mp4`);
}
```

## 📊 性能優化

### 影片加載優化
```typescript
// 影片分段加載策略
class SegmentedVideoLoader {
  async loadVideoInChunks(url: string, chunkSize: number = 1024 * 1024): Promise<Blob> {
    const response = await fetch(url);
    const contentLength = parseInt(response.headers.get('content-length') || '0');
    
    if (contentLength < chunkSize) {
      return response.blob(); // 小檔案直接加載
    }
    
    // 大檔案分段加載
    const chunks: Blob[] = [];
    for (let start = 0; start < contentLength; start += chunkSize) {
      const end = Math.min(start + chunkSize - 1, contentLength - 1);
      const chunkResponse = await fetch(url, {
        headers: { Range: `bytes=${start}-${end}` }
      });
      chunks.push(await chunkResponse.blob());
    }
    
    return new Blob(chunks);
  }
}
```

### CDN 智能選擇
```typescript
interface CDNEndpoint {
  url: string;
  region: string;
  latency?: number;
}

class CDNSelector {
  private endpoints: CDNEndpoint[] = [
    { url: 'https://cdn1.example.com/videos/', region: 'us-east' },
    { url: 'https://cdn2.example.com/videos/', region: 'eu-west' },
    { url: 'https://cdn3.example.com/videos/', region: 'ap-southeast' },
  ];
  
  async selectOptimalCDN(): Promise<string> {
    // 並行測試所有CDN的延遲
    const latencyTests = this.endpoints.map(async (endpoint) => {
      const start = performance.now();
      try {
        await fetch(`${endpoint.url}ping.txt`, { method: 'HEAD' });
        endpoint.latency = performance.now() - start;
        return endpoint;
      } catch {
        endpoint.latency = Infinity;
        return endpoint;
      }
    });
    
    const results = await Promise.all(latencyTests);
    
    // 選擇延遲最低的CDN
    const optimal = results.reduce((best, current) => 
      (current.latency || Infinity) < (best.latency || Infinity) ? current : best
    );
    
    return optimal.url;
  }
}
```

## 🧪 測試策略簡化

### 之前需要測試的複雜邏輯
- ❌ 物理引擎精確度測試
- ❌ 碰撞檢測準確性測試  
- ❌ 軌跡計算性能測試
- ❌ 多物件互動測試
- ❌ 動畫同步測試

### 現在需要測試的簡化邏輯
```typescript
describe('Simplified Game Logic Tests', () => {
  
  test('勝負判定準確性', () => {
    const testCases = [
      { opponents: 1, randomValue: 0.4, expectedWin: true },
      { opponents: 1, randomValue: 0.5, expectedWin: false },
      { opponents: 5, randomValue: 0.1, expectedWin: true },
      { opponents: 5, randomValue: 0.2, expectedWin: false },
    ];
    
    testCases.forEach(({ opponents, randomValue, expectedWin }) => {
      const result = randomValue < WIN_PROBABILITIES[opponents];
      expect(result).toBe(expectedWin);
    });
  });
  
  test('影片URL生成正確性', () => {
    const url = generateVideoUrl(6, 3, true);
    expect(url).toBe('/static/videos/tunnel-game/T6/T6_O3_WIN.mp4');
  });
  
  test('RTP計算準確性', () => {
    const rtp = calculateRTP(1); // 0.48 * 1.8 = 0.864
    expect(rtp).toBeCloseTo(0.864, 3);
  });
  
  test('Provably Fair驗證', () => {
    const input = {
      finalHash: 'abc123',
      serverSeed: '{"random":"1;2;3;4;5"}',
      playerTunnel: 1,
      opponentCount: 1,
      betAmount: 100
    };
    
    const result1 = generateResult(input);
    const result2 = generateResult(input);
    
    // 相同輸入應產生相同結果
    expect(result1.playerWin).toBe(result2.playerWin);
    expect(result1.videoUrl).toBe(result2.videoUrl);
  });
});
```

## 📈 數據分析簡化

### 需要追蹤的簡化指標
```typescript
interface SimplifiedGameMetrics {
  // 移除複雜的物理指標
  // averageCollisionCount: number;
  // objectHitDistribution: Map<number, number>;
  // trajectoryAccuracy: number;
  
  // 保留核心業務指標
  totalGames: number;
  winRateByOpponents: Map<number, number>;
  popularTunnelChoices: Map<number, number>;
  averageBetAmount: number;
  totalRevenue: number;
  
  // 新增影片相關指標
  videoLoadTimes: number[];
  videoPlaybackErrors: number;
  mostViewedVideos: Map<string, number>;
  cdnPerformance: Map<string, number>;
}
```

## 🚀 部署簡化

### 基礎設施需求降低
```yaml
# 之前: 高性能物理計算需求
resources:
  cpu: "2000m"      # 需要高CPU進行物理計算
  memory: "4Gi"     # 需要大內存存儲物理狀態
  
# 現在: 低資源需求
resources:
  cpu: "200m"       # 只需要基本的邏輯計算
  memory: "512Mi"   # 最小內存需求
```

### CDN配置簡化
```typescript
// 影片CDN配置
const CDN_CONFIG = {
  // 主要CDN節點
  primary: {
    url: 'https://videos-cdn1.example.com/',
    regions: ['us-east', 'eu-west', 'ap-southeast']
  },
  
  // 備用CDN節點  
  fallback: {
    url: 'https://videos-cdn2.example.com/',
    regions: ['global']
  },
  
  // 本地備用
  local: {
    url: '/static/videos/',
    regions: ['localhost']
  }
};
```

---

## 📋 開發時間估算

### 大幅縮短的開發周期

| 階段 | 原計劃 | 簡化版 | 節省時間 |
|------|--------|--------|----------|
| 後端邏輯 | 2-3週 | 3-5天 | 省70% |
| 前端組件 | 2-3週 | 5-7天 | 省60% |
| 物理引擎 | 3-4週 | 0天 | 省100% |
| 動畫系統 | 2-3週 | 3-5天 | 省75% |
| 測試調優 | 1-2週 | 3-5天 | 省60% |
| **總計** | **10-15週** | **3-4週** | **省75%** |

### 維護成本降低
- **代碼複雜度**: 從高複雜度降至低複雜度
- **服務器資源**: CPU/內存需求降低80%
- **調試難度**: 從複雜物理問題降至簡單邏輯問題
- **擴展難度**: 從困難降至簡單

這個簡化版本在保持遊戲樂趣的同時，大幅降低了技術複雜度和開發成本！🎉
