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

// 新的結果接口，用於軌道彈珠遊戲
interface TunnelGameResult {
    playerTunnel: number;
    opponentCount: number;
    playerWin: boolean;
    videoUrl: string;
    winAmount: number;
    randomValue: number;
    usedProbability: number;
}

// 為了保持向後兼容，保留舊的 SoccerShotResult 接口映射
interface SoccerShotResult {
    isGoal: boolean;           // 映射為 playerWin
    horizontalZone: 'left' | 'center' | 'right';
    verticalZone: 'top' | 'bottom';  
    ballX: number;
    ballY: number;
    keeperX: number;
    keeperY: number;
    shotPower: number;
    shotAccuracy: number;
    // 新增軌道遊戲相關字段
    playerTunnel?: number;
    opponentCount?: number;
    videoUrl?: string;
    randomValue?: number;
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
 * 從隨機數中提取軌道和對手數量
 */
function extractGameParams(randomNumbers: number[]): { playerTunnel: number, opponentCount: number } {
    // 使用隨機數來決定軌道和對手數量（如果未在參數中指定）
    const playerTunnel = (randomNumbers[0] % 6) + 1; // 1-6軌道
    const opponentCount = (randomNumbers[1] % 5) + 1; // 1-5對手
    return { playerTunnel, opponentCount };
}

/**
 * 主要遊戲結果生成函數
 * 簡化版：僅基於機率判定輸贏，返回對應影片URL
 */
export const generateResult = ({ 
    finalHash, 
    serverSeed, 
    playerTunnel, 
    opponentCount 
}: { 
    finalHash: string; 
    serverSeed: string;
    playerTunnel?: number;
    opponentCount?: number;
}): SoccerShotResult => {
    // 解析服務器種子中的隨機數
    const randomNumbers: number[] = JSON.parse(serverSeed)
        .random.split(";")
        .slice(0, 2) // 只需要2個隨機數：一個用於勝負判定，一個用於提取參數
        .map((x: string) => +x);

    // 如果未指定軌道和對手數量，從隨機數中提取
    const gameParams = (playerTunnel && opponentCount) ? 
        { playerTunnel, opponentCount } : 
        extractGameParams(randomNumbers);

    // 生成0-1之間的隨機數用於勝負判定
    const randomValue = generateRandomValue(finalHash, serverSeed);
    
    // 獲取該對手數量下的勝率
    const winProbability = WIN_PROBABILITIES[gameParams.opponentCount] || 0.48;
    
    // 判定玩家是否獲勝
    const playerWin = randomValue < winProbability;
    
    // 生成對應的影片URL
    const videoUrl = generateVideoUrl(gameParams.playerTunnel, gameParams.opponentCount, playerWin);

    // 為了保持向後兼容性，返回SoccerShotResult格式
    // 但實際上已經是軌道遊戲的邏輯
    return {
        isGoal: playerWin,  // 映射：獲勝 -> 進球
        horizontalZone: gameParams.playerTunnel <= 2 ? 'left' : 
                       gameParams.playerTunnel <= 4 ? 'center' : 'right',
        verticalZone: gameParams.opponentCount <= 2 ? 'bottom' : 'top',
        ballX: gameParams.playerTunnel / 6,
        ballY: gameParams.opponentCount / 5,
        keeperX: 0.5, // 預設值
        keeperY: 0.5, // 預設值
        shotPower: randomValue,
        shotAccuracy: randomValue,
        // 新增的軌道遊戲字段
        playerTunnel: gameParams.playerTunnel,
        opponentCount: gameParams.opponentCount,
        videoUrl: videoUrl,
        randomValue: randomValue
    };
};

/**
 * 結算結果處理
 * 保持向後兼容的同時支持新的軌道遊戲邏輯
 */
export const getSettlementResult = (roundResult: SoccerShotResult): Record<string, boolean> => {
    // 如果是新的軌道遊戲結果，使用新的邏輯
    if (roundResult.playerTunnel && roundResult.opponentCount) {
        return {
            // 軌道選擇結果（假設玩家總是贏得軌道選擇）
            tunnel1: roundResult.playerTunnel === 1,
            tunnel2: roundResult.playerTunnel === 2,
            tunnel3: roundResult.playerTunnel === 3,
            tunnel4: roundResult.playerTunnel === 4,
            tunnel5: roundResult.playerTunnel === 5,
            tunnel6: roundResult.playerTunnel === 6,
            
            // 對手數量結果（假設玩家總是贏得對手選擇）
            opponent1: roundResult.opponentCount === 1,
            opponent2: roundResult.opponentCount === 2,
            opponent3: roundResult.opponentCount === 3,
            opponent4: roundResult.opponentCount === 4,
            opponent5: roundResult.opponentCount === 5,
            
            // 主要的輸贏結果
            win: roundResult.isGoal,
            lose: !roundResult.isGoal
        };
    }
    
    // 保持舊的足球邏輯作為向後兼容
    return {
        goal: roundResult.isGoal,
        miss: !roundResult.isGoal,
        left: roundResult.isGoal && roundResult.horizontalZone === 'left',
        center: roundResult.isGoal && roundResult.horizontalZone === 'center',
        right: roundResult.isGoal && roundResult.horizontalZone === 'right',
        top: roundResult.isGoal && roundResult.verticalZone === 'top',
        bottom: roundResult.isGoal && roundResult.verticalZone === 'bottom',
    };
};

/**
 * 獲取特定配置的勝率（新增的輔助函數）
 */
export const getWinProbability = (opponentCount: number): number => {
    return WIN_PROBABILITIES[opponentCount] || 0.48;
};

/**
 * 獲取特定配置的賠率（新增的輔助函數）
 */
export const getOdds = (opponentCount: number): number => {
    return ODDS_TABLE[opponentCount] || 1.8;
};

/**
 * 計算理論回報率 (RTP)
 */
export const calculateRTP = (opponentCount: number): number => {
    const winProbability = WIN_PROBABILITIES[opponentCount];
    const odds = ODDS_TABLE[opponentCount];
    return winProbability * odds;
};

/**
 * 獲取所有可能的影片URL列表
 */
export const getAllPossibleVideoUrls = (): string[] => {
    const urls: string[] = [];
    
    for (let tunnel = 1; tunnel <= 6; tunnel++) {
        for (let opponents = 1; opponents <= 5; opponents++) {
            urls.push(generateVideoUrl(tunnel, opponents, true));  // WIN
            urls.push(generateVideoUrl(tunnel, opponents, false)); // LOSS
        }
    }
    
    return urls;
};

// Export types for use in other files
export type { SoccerShotResult, TunnelGameResult };