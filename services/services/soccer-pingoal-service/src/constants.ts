// 軌道彈珠遊戲常數配置

// 軌道選擇
export const TUNNEL_CHOICES = {
    tunnel1: "tunnel1",
    tunnel2: "tunnel2", 
    tunnel3: "tunnel3",
    tunnel4: "tunnel4",
    tunnel5: "tunnel5",
    tunnel6: "tunnel6",
};

// 對手數量選擇
export const OPPONENT_CHOICES = {
    opponent1: "opponent1",
    opponent2: "opponent2",
    opponent3: "opponent3", 
    opponent4: "opponent4",
    opponent5: "opponent5",
};

// 主要投注選項（輸贏）
export const MAIN_BET_CHOICES = {
    win: "win",
    lose: "lose",
};

// 所有投注選項（與前端保持一致）
export const BET_CHOICES = {
    // 主要輸贏選項
    win: "win",
    draw: "draw", 
    lose: "lose",
    
    // 隧道選項
    tunnel1: "tunnel1",
    tunnel2: "tunnel2", 
    tunnel3: "tunnel3",
    tunnel4: "tunnel4",
    tunnel5: "tunnel5",
    tunnel6: "tunnel6",
    
    // 對手數量選項
    opponent1: "opponent1",
    opponent2: "opponent2",
    opponent3: "opponent3",
    opponent4: "opponent4",
    opponent5: "opponent5",
    
    // 舊的足球遊戲選項（向後兼容）
    goal: "goal",
    miss: "miss",
    left: "left",
    right: "right",
    center: "center",
    top: "top",
    bottom: "bottom",
};

// 軌道遊戲配置常數
export const TUNNEL_COUNT = 6;
export const MAX_OPPONENTS = 5;
export const MIN_OPPONENTS = 1;

// 勝率配置
export const WIN_PROBABILITIES = {
    1: 0.48,   // 1個對手 - 48% 勝率
    2: 0.32,   // 2個對手 - 32% 勝率  
    3: 0.24,   // 3個對手 - 24% 勝率
    4: 0.19,   // 4個對手 - 19% 勝率
    5: 0.155   // 5個對手 - 15.5% 勝率
};

// 賠率表
export const ODDS_TABLE = {
    1: 1.8,
    2: 2.5,
    3: 3.2,
    4: 4.0,
    5: 5.5
};

// 影片系統配置
export const VIDEO_CONFIG = {
    baseUrl: "/static/videos/tunnel-game",
    format: "mp4",
    totalVideos: 60, // 6軌道 × 5對手 × 2結果
};

// 系統配置（保持不變）
export const SERVER_SEED_SECRET_LENGTH = 32;
export const NUMBER_BUTTONS = 6; // 更新為6個軌道按鈕
export const RANDOM_VALUE_RANGE = {
    min: 1,
    max: 255, // 更新範圍以支持更好的隨機數生成
};

// 遊戲時間配置
export const GAME_DURATIONS = {
    wholeRound: 35,      // 整輪遊戲時間
    placingBets: 25,     // 下注階段
    preparation: 3,      // 準備階段
    videoPlaying: 5,     // 影片播放時間
    settlement: 2,       // 結算時間
};

// 隨機數生成配置（簡化版）
export const REQUIRED_RANDOM_COUNT = 2; // 只需要2個隨機數（勝負判定 + 參數提取）
