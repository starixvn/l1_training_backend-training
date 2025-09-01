// Soccer PinGoal - Simplified Result Helper
// 預錄影片版本 - 移除複雜物理引擎，僅基於機率判定輸贏

import { createHash } from 'crypto';

// 勝率配置（略低於理論值以確保平台盈利）
const WIN_PROBABILITIES: Record<number, number> = {
    1: 0.48,   // 1個對手 - 48% 勝率
    2: 0.32,   // 2個對手 - 32% 勝率  
    3: 0.24,   // 3個對手 - 24% 勝率
    4: 0.19,   // 4個對手 - 19% 勝率
    5: 0.155   // 5個對手 - 15.5% 勝率
};

// 賠率表
const ODDS_TABLE: Record<number, number> = {
    1: 1.8,
    2: 2.5,
    3: 3.2,
    4: 4.0,
    5: 5.5
};

// 影片基礎URL配置
const VIDEO_BASE_URL = "/static/videos/tunnel-game";

interface TunnelGameInput {
    finalHash: string;
    serverSeed: string;
    playerTunnel: number;    // 1-6
    opponentCount: number;   // 1-5
    betAmount: number;
}

interface TunnelGameResult {
    playerTunnel: number;
    opponentCount: number;
    playerWin: boolean;
    videoUrl: string;
    winAmount: number;
    randomValue: number;     // 用於Provably Fair驗證
    usedProbability: number; // 使用的勝率
}

/**
 * 生成單一隨機數值 (0-1之間)
 * 用於判定玩家輸贏
 */
function generateRandomValue(finalHash: string, serverSeed: string): number {
    // 結合 finalHash 和 serverSeed 生成隨機值
    const combinedSeed = `${serverSeed}:${finalHash}`;
    const hash = createHash('sha256').update(combinedSeed).digest('hex');
    
    // 取前8位十六進制轉為整數，再轉為0-1之間的小數
    const randomInt = parseInt(hash.substring(0, 8), 16);
    return randomInt / 0xFFFFFFFF;
}

/**
 * 生成影片URL
 * 格式: T{軌道}_O{對手數}_{結果}.mp4
 */
function generateVideoUrl(playerTunnel: number, opponentCount: number, playerWin: boolean): string {
    const result = playerWin ? 'WIN' : 'LOSS';
    const filename = `T${playerTunnel}_O${opponentCount}_${result}.mp4`;
    return `${VIDEO_BASE_URL}/T${playerTunnel}/${filename}`;
}

/**
 * 驗證輸入參數
 */
function validateGameInput(input: TunnelGameInput): boolean {
    const { playerTunnel, opponentCount, betAmount } = input;
    
    if (playerTunnel < 1 || playerTunnel > 6) {
        throw new Error(`Invalid player tunnel: ${playerTunnel}. Must be 1-6.`);
    }
    
    if (opponentCount < 1 || opponentCount > 5) {
        throw new Error(`Invalid opponent count: ${opponentCount}. Must be 1-5.`);
    }
    
    if (betAmount <= 0) {
        throw new Error(`Invalid bet amount: ${betAmount}. Must be positive.`);
    }
    
    return true;
}

/**
 * 主要遊戲結果生成函數
 * 簡化版：僅基於機率判定輸贏，返回對應影片URL
 */
export const generateResult = (input: TunnelGameInput): TunnelGameResult => {
    // 驗證輸入
    validateGameInput(input);
    
    const { finalHash, serverSeed, playerTunnel, opponentCount, betAmount } = input;
    
    // 生成0-1之間的隨機數
    const randomValue = generateRandomValue(finalHash, serverSeed);
    
    // 獲取該對手數量下的勝率
    const winProbability = WIN_PROBABILITIES[opponentCount];
    
    // 判定玩家是否獲勝
    const playerWin = randomValue < winProbability;
    
    // 計算獎金
    const winAmount = playerWin ? betAmount * ODDS_TABLE[opponentCount] : 0;
    
    // 生成對應的影片URL
    const videoUrl = generateVideoUrl(playerTunnel, opponentCount, playerWin);
    
    return {
        playerTunnel,
        opponentCount,
        playerWin,
        videoUrl,
        winAmount,
        randomValue,
        usedProbability: winProbability
    };
};

/**
 * 結算結果處理
 * 返回客戶端需要的結算信息
 */
export const getSettlementResult = (roundResult: TunnelGameResult) => {
    return {
        playerWin: roundResult.playerWin,
        winAmount: roundResult.winAmount,
        videoUrl: roundResult.videoUrl,
        playerTunnel: roundResult.playerTunnel,
        opponentCount: roundResult.opponentCount
    };
};

/**
 * Provably Fair 驗證函數
 * 允許玩家驗證遊戲結果的公平性
 */
export const verifyGameResult = (
    input: TunnelGameInput,
    expectedResult: TunnelGameResult
): boolean => {
    try {
        const calculatedResult = generateResult(input);
        
        return (
            calculatedResult.playerWin === expectedResult.playerWin &&
            calculatedResult.randomValue === expectedResult.randomValue &&
            calculatedResult.videoUrl === expectedResult.videoUrl
        );
    } catch (error) {
        console.error('Game result verification failed:', error);
        return false;
    }
};

/**
 * 獲取所有可能的影片URL列表
 * 用於預加載或CDN部署
 */
export const getAllPossibleVideoUrls = (): string[] => {
    const urls: string[] = [];
    
    // 遍歷所有可能的組合
    for (let tunnel = 1; tunnel <= 6; tunnel++) {
        for (let opponents = 1; opponents <= 5; opponents++) {
            urls.push(generateVideoUrl(tunnel, opponents, true));  // WIN
            urls.push(generateVideoUrl(tunnel, opponents, false)); // LOSS
        }
    }
    
    return urls;
};

/**
 * 獲取特定配置的勝率
 * 用於前端顯示或分析
 */
export const getWinProbability = (opponentCount: number): number => {
    return WIN_PROBABILITIES[opponentCount] || 0;
};

/**
 * 獲取特定配置的賠率
 * 用於前端顯示
 */
export const getOdds = (opponentCount: number): number => {
    return ODDS_TABLE[opponentCount] || 1;
};

/**
 * 計算理論回報率 (RTP)
 * 用於遊戲平衡分析
 */
export const calculateRTP = (opponentCount: number): number => {
    const winProbability = WIN_PROBABILITIES[opponentCount];
    const odds = ODDS_TABLE[opponentCount];
    const lossProbability = 1 - winProbability;
    
    // RTP = (勝率 × 賠率) + (敗率 × 0)
    return winProbability * odds;
};

/**
 * 獲取遊戲統計信息
 */
export const getGameStats = () => {
    const stats = [];
    
    for (let opponents = 1; opponents <= 5; opponents++) {
        stats.push({
            opponentCount: opponents,
            winProbability: WIN_PROBABILITIES[opponents],
            odds: ODDS_TABLE[opponents],
            rtp: calculateRTP(opponents),
            houseEdge: 1 - calculateRTP(opponents)
        });
    }
    
    return stats;
};

// 導出類型供其他模塊使用
export type { TunnelGameInput, TunnelGameResult };
