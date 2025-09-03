import { 
    BET_CHOICES, 
    TUNNEL_CHOICES, 
    OPPONENT_CHOICES, 
    MAIN_BET_CHOICES,
    GAME_DURATIONS,
    WIN_PROBABILITIES,
    ODDS_TABLE,
    VIDEO_CONFIG
} from "./constants";

export default {
    id: 200,
    name: "soccerpingoal",
    
    // 遊戲時間設定（簡化版）
    durations: {
        wholeRound: GAME_DURATIONS.wholeRound,        // 35秒
        placingBets: GAME_DURATIONS.placingBets,      // 25秒
        preparation: GAME_DURATIONS.preparation,       // 3秒
        videoPlaying: GAME_DURATIONS.videoPlaying,     // 5秒
        settlement: GAME_DURATIONS.settlement,         // 2秒
        lockingBet: 2, // 鎖定投注時間
        
        // 移除舊的足球動畫設定
        // shotAnimationDuration: 2,
    },
    
    // 投注選項（包含軌道、對手數量、輸贏）
    choices: [
        // 軌道選擇
        ...Object.values(TUNNEL_CHOICES),
        // 對手數量選擇  
        ...Object.values(OPPONENT_CHOICES),
        // 輸贏選擇
        ...Object.values(MAIN_BET_CHOICES),
        // 保留舊的選項以向後兼容
        BET_CHOICES.goal, BET_CHOICES.miss
    ],
    
    // 選項映射（更新為軌道遊戲）
    choicesMapper: {
        // 軌道選擇映射
        tunnel1: 1, tunnel2: 2, tunnel3: 3, 
        tunnel4: 4, tunnel5: 5, tunnel6: 6,
        
        // 對手數量映射
        opponent1: 11, opponent2: 12, opponent3: 13,
        opponent4: 14, opponent5: 15,
        
        // 輸贏映射
        win: 21, lose: 22,
        
        // 保留舊的映射以向後兼容
        goal: 31, miss: 32, 
        left: 33, right: 34, center: 35, 
        top: 36, bottom: 37
    },
    
    // 對沖投注組（互斥的投注選項）
    hedgeBetGroups: [
        // 軌道選擇（互斥）
        [TUNNEL_CHOICES.tunnel1, TUNNEL_CHOICES.tunnel2, TUNNEL_CHOICES.tunnel3, 
         TUNNEL_CHOICES.tunnel4, TUNNEL_CHOICES.tunnel5, TUNNEL_CHOICES.tunnel6],
        
        // 對手數量選擇（互斥）
        [OPPONENT_CHOICES.opponent1, OPPONENT_CHOICES.opponent2, OPPONENT_CHOICES.opponent3,
         OPPONENT_CHOICES.opponent4, OPPONENT_CHOICES.opponent5],
        
        // 輸贏選擇（互斥）
        [MAIN_BET_CHOICES.win, MAIN_BET_CHOICES.lose],
        
        // 保留舊的對沖組以向後兼容
        [BET_CHOICES.goal, BET_CHOICES.miss],
        [BET_CHOICES.left, BET_CHOICES.center, BET_CHOICES.right], 
        [BET_CHOICES.top, BET_CHOICES.bottom]
    ],
    
    // 遊戲歷史記錄設定
    numberOfRoundHistory: 100,
    historyPageSize: 10,
    provablyFair: true,
    
    // 機器人設定（更新為軌道遊戲）
    botSettings: {
        ratio: { mainOption: 60, sideOption: 30, tunnelOption: 10 },
        
        // 主要選項：輸贏投注（最常見）
        mainOption: [MAIN_BET_CHOICES.win, MAIN_BET_CHOICES.lose],
        
        // 次要選項：對手數量選擇
        sideOption: [
            OPPONENT_CHOICES.opponent1, OPPONENT_CHOICES.opponent2, 
            OPPONENT_CHOICES.opponent3, OPPONENT_CHOICES.opponent4, 
            OPPONENT_CHOICES.opponent5
        ],
        
        // 軌道選項：軌道選擇（較少使用）
        tunnelOption: [
            TUNNEL_CHOICES.tunnel1, TUNNEL_CHOICES.tunnel2, TUNNEL_CHOICES.tunnel3,
            TUNNEL_CHOICES.tunnel4, TUNNEL_CHOICES.tunnel5, TUNNEL_CHOICES.tunnel6
        ]
    },
    
    // 新增：遊戲特定配置
    gameConfig: {
        // 軌道數量
        tunnelCount: 6,
        
        // 對手範圍
        opponentRange: { min: 1, max: 5 },
        
        // 勝率表
        winProbabilities: WIN_PROBABILITIES,
        
        // 賠率表
        oddsTable: ODDS_TABLE,
        
        // 影片系統配置
        videoConfig: VIDEO_CONFIG,
        
        // 隨機數需求（簡化版）
        requiredRandomCount: 2,
        
        // 遊戲類型標識
        gameType: "tunnel-race",
        version: "simplified-v1.0"
    },
    
    // 新增：統計和分析配置
    analytics: {
        trackPlayerChoices: true,
        trackWinRates: true,
        trackVideoPerformance: true,
        popularityThreshold: 0.1, // 10% 以上選擇率視為熱門
    }
};
