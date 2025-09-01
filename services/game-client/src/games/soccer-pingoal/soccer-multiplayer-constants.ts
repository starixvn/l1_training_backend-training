import { buildVersion } from "../../_shared/constants";

export const SoccerPinGoalBetOptions = {
    GOAL: "goal",
    MISS: "miss",
    LEFT: "left",
    RIGHT: "right",
    CENTER: "center",
    TOP: "top",
    BOTTOM: "bottom",
};

export const SoccerPinGoalChoices = {
    goal: "goal",
    miss: "miss",
    left: "left",
    right: "right",
    center: "center",
    top: "top",
    bottom: "bottom",
};

export const mainChoices = [SoccerPinGoalChoices.goal, SoccerPinGoalChoices.miss];
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

export type SoccerPinGoalSettlementResult = {
    goal: boolean;
    miss: boolean;
    left: boolean;
    right: boolean;
    center: boolean;
    top: boolean;
    bottom: boolean;
};

export type SoccerPinGoalResult = {
    isGoal: boolean;
    position: "left" | "right" | "center" | "top" | "bottom";
    ballX: number;
    ballY: number;
    keeperX: number;
    keeperY: number;
};

export type ShotResult = {
    success: boolean;
    position: { x: number; y: number };
};