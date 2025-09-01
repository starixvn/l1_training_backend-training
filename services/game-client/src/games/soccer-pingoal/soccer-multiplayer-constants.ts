import { buildVersion } from "../../_shared/constants";

// 軌道選擇選項
export const SoccerPinGoalTunnelOptions = {
    TUNNEL1: "tunnel1",
    TUNNEL2: "tunnel2", 
    TUNNEL3: "tunnel3",
    TUNNEL4: "tunnel4",
    TUNNEL5: "tunnel5",
    TUNNEL6: "tunnel6",
};

// 對手數量選項
export const SoccerPinGoalOpponentOptions = {
    OPPONENT1: "opponent1",
    OPPONENT2: "opponent2",
    OPPONENT3: "opponent3",
    OPPONENT4: "opponent4",
    OPPONENT5: "opponent5",
};

// 主要投注選項（輸贏）
export const SoccerPinGoalBetOptions = {
    WIN: "win",
    LOSE: "lose",
    // 保留舊選項以向後兼容
    GOAL: "goal",
    MISS: "miss",
    LEFT: "left",
    RIGHT: "right",
    CENTER: "center",
    TOP: "top",
    BOTTOM: "bottom",
};

export const SoccerPinGoalChoices = {
    // 軌道選擇
    tunnel1: "tunnel1",
    tunnel2: "tunnel2",
    tunnel3: "tunnel3", 
    tunnel4: "tunnel4",
    tunnel5: "tunnel5",
    tunnel6: "tunnel6",
    // 對手數量
    opponent1: "opponent1",
    opponent2: "opponent2",
    opponent3: "opponent3",
    opponent4: "opponent4", 
    opponent5: "opponent5",
    // 輸贏選項
    win: "win",
    lose: "lose",
    // 保留舊選項以向後兼容
    goal: "goal",
    miss: "miss",
    left: "left",
    right: "right",
    center: "center",
    top: "top",
    bottom: "bottom",
};

// 更新選項分組
export const tunnelChoices = [
    SoccerPinGoalChoices.tunnel1, SoccerPinGoalChoices.tunnel2, SoccerPinGoalChoices.tunnel3,
    SoccerPinGoalChoices.tunnel4, SoccerPinGoalChoices.tunnel5, SoccerPinGoalChoices.tunnel6
];

export const opponentChoices = [
    SoccerPinGoalChoices.opponent1, SoccerPinGoalChoices.opponent2, SoccerPinGoalChoices.opponent3,
    SoccerPinGoalChoices.opponent4, SoccerPinGoalChoices.opponent5
];

export const mainChoices = [SoccerPinGoalChoices.win, SoccerPinGoalChoices.lose];

// 保留舊的分組以向後兼容
export const positionChoices = [SoccerPinGoalChoices.left, SoccerPinGoalChoices.center, SoccerPinGoalChoices.right];
export const heightChoices = [SoccerPinGoalChoices.top, SoccerPinGoalChoices.bottom];

// Statistic bar colors (matches SCSS variables)
export const SoccerPinGoalStatisticColors = {
    goal: "#22C55E", // Green for goal
    miss: "#EF4444", // Red for miss
};

// Percentage ring colors
export const SoccerPinGoalBetOptionsPercentageColor = {
    goal: "#86EFAC",
    miss: "#FCA5A5",
};

// Position and outcome mapping for soccer-pingoal
export const PositionMapper: Record<string, { x: number; y: number }> = {
    left: { x: 0.2, y: 0.5 },
    center: { x: 0.5, y: 0.5 },
    right: { x: 0.8, y: 0.5 },
    top: { x: 0.5, y: 0.3 },
    bottom: { x: 0.5, y: 0.7 },
};

export const BetChoiceImagesData: Record<string, { src: string; blur: string }> = {
    goal: {
        src: `/static/images/soccer-pingoal/2x/bg-goal.webp?v=${buildVersion}`,
        blur: ``,
    },
    miss: {
        src: `/static/images/soccer-pingoal/2x/bg-miss.webp?v=${buildVersion}`,
        blur: ``,
    },
    left: {
        src: `/static/images/soccer-pingoal/2x/bg-left.webp?v=${buildVersion}`,
        blur: "",
    },
    right: {
        src: `/static/images/soccer-pingoal/2x/bg-right.webp?v=${buildVersion}`,
        blur: "",
    },
    center: {
        src: `/static/images/soccer-pingoal/2x/bg-center.webp?v=${buildVersion}`,
        blur: "",
    },
    top: {
        src: `/static/images/soccer-pingoal/2x/bg-top.webp?v=${buildVersion}`,
        blur: "",
    },
    bottom: {
        src: `/static/images/soccer-pingoal/2x/bg-bottom.webp?v=${buildVersion}`,
        blur: "",
    },
};

export const ChoiceSoccerPinGoalIconMapper: Record<string, { position: string; outcome: boolean }> = {
    goal: { position: "any", outcome: true },
    miss: { position: "any", outcome: false },
    left: { position: "left", outcome: true },
    right: { position: "right", outcome: true },
    center: { position: "center", outcome: true },
    top: { position: "top", outcome: true },
    bottom: { position: "bottom", outcome: true },
};

// 軌道遊戲結算結果類型
export type SoccerPinGoalSettlementResult = {
    // 軌道選擇結果
    tunnel1: boolean;
    tunnel2: boolean;
    tunnel3: boolean;
    tunnel4: boolean;
    tunnel5: boolean;
    tunnel6: boolean;
    // 對手數量結果
    opponent1: boolean;
    opponent2: boolean;
    opponent3: boolean;
    opponent4: boolean;
    opponent5: boolean;
    // 輸贏結果
    win: boolean;
    lose: boolean;
    // 保留舊選項以向後兼容
    goal: boolean;
    miss: boolean;
    left: boolean;
    right: boolean;
    center: boolean;
    top: boolean;
    bottom: boolean;
};

// 軌道遊戲結果類型
export type SoccerPinGoalResult = {
    // 基本遊戲結果
    isGoal: boolean;                    // 是否獲勝（向後兼容）
    playerTunnel: number;              // 玩家選擇的軌道 (1-6)
    opponentCount: number;             // 對手數量 (1-5)
    videoUrl?: string;                 // 影片URL（demo時可選）
    randomValue?: number;              // 隨機值（Provably Fair）
    
    // 映射字段（向後兼容）
    position?: "left" | "right" | "center" | "top" | "bottom";
    ballX?: number;
    ballY?: number;
    keeperX?: number;
    keeperY?: number;
    horizontalZone?: "left" | "center" | "right";
    verticalZone?: "top" | "bottom";
    shotPower?: number;
    shotAccuracy?: number;
};

// 簡化的遊戲結果（用於文字顯示）
export type TunnelGameTextResult = {
    playerTunnel: number;              // 玩家軌道 1-6
    opponentCount: number;             // 對手數量 1-5
    playerWin: boolean;                // 玩家是否獲勝
    winProbability: number;            // 獲勝機率
    odds: number;                      // 賠率
    videoUrl?: string;                 // 影片URL（可選）
};

export type ShotResult = {
    success: boolean;
    position: { x: number; y: number };
};

// 軌道和對手數量的顯示名稱映射
export const TunnelDisplayNames = {
    1: "軌道 1",
    2: "軌道 2", 
    3: "軌道 3",
    4: "軌道 4",
    5: "軌道 5",
    6: "軌道 6"
};

export const OpponentDisplayNames = {
    1: "1 個對手",
    2: "2 個對手",
    3: "3 個對手", 
    4: "4 個對手",
    5: "5 個對手"
};

// 勝率和賠率對應表（與後端保持一致）
export const WinProbabilities = {
    1: 0.48,   // 48%
    2: 0.32,   // 32%
    3: 0.24,   // 24%
    4: 0.19,   // 19%
    5: 0.155   // 15.5%
};

export const OddsTable = {
    1: 1.8,
    2: 2.5,
    3: 3.2,
    4: 4.0,
    5: 5.5
};