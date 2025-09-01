import { RANDOM_VALUE_RANGE } from "../constants";

// Soccer goal dimensions and zones
const GOAL_ZONES = {
    // Horizontal zones (0-1 scale)
    LEFT: { min: 0.0, max: 0.33 },
    CENTER: { min: 0.33, max: 0.67 },
    RIGHT: { min: 0.67, max: 1.0 },
    
    // Vertical zones (0-1 scale, 0 = bottom, 1 = top)
    BOTTOM: { min: 0.0, max: 0.5 },
    TOP: { min: 0.5, max: 1.0 }
};

// Goalkeeper save probability based on shot position
const GOALKEEPER_SAVE_ZONES = {
    // Higher values mean easier saves
    CENTER_BOTTOM: 0.65,  // Most saveable
    CENTER_TOP: 0.45,     // Medium difficulty
    SIDE_BOTTOM: 0.35,    // Harder to save
    SIDE_TOP: 0.25,       // Most difficult
    CORNERS: 0.15         // Nearly impossible to save
};

const settlementRuleEntries = Object.entries({
    goal: (shotResult: SoccerShotResult) => shotResult.isGoal,
    miss: (shotResult: SoccerShotResult) => !shotResult.isGoal,
    left: (shotResult: SoccerShotResult) => shotResult.isGoal && shotResult.horizontalZone === 'left',
    center: (shotResult: SoccerShotResult) => shotResult.isGoal && shotResult.horizontalZone === 'center',
    right: (shotResult: SoccerShotResult) => shotResult.isGoal && shotResult.horizontalZone === 'right',
    top: (shotResult: SoccerShotResult) => shotResult.isGoal && shotResult.verticalZone === 'top',
    bottom: (shotResult: SoccerShotResult) => shotResult.isGoal && shotResult.verticalZone === 'bottom',
});

interface SoccerShotResult {
    ballX: number;           // Ball horizontal position (0-1)
    ballY: number;           // Ball vertical position (0-1)
    keeperX: number;         // Goalkeeper horizontal position (0-1)
    keeperY: number;         // Goalkeeper vertical position (0-1)
    isGoal: boolean;         // Whether the shot results in a goal
    horizontalZone: 'left' | 'center' | 'right';
    verticalZone: 'top' | 'bottom';
    shotPower: number;       // Shot power (affects save difficulty)
    shotAccuracy: number;    // Shot accuracy (affects ball placement)
}

const parseFinalHashToNumbers = (finalHash: string, length: number): number[] => {
    const increments = [];
    for (let i = 0; i < length; i++) {
        const value = parseInt(finalHash.slice(i * 2, i * 2 + 2), 16);
        increments.push(value);
    }
    return increments;
};

const normalizeValue = (value: number, min: number, max: number): number => {
    return ((value % (max - min)) + (max - min)) / (max - min);
};

const determineHorizontalZone = (x: number): 'left' | 'center' | 'right' => {
    if (x <= GOAL_ZONES.LEFT.max) return 'left';
    if (x <= GOAL_ZONES.CENTER.max) return 'center';
    return 'right';
};

const determineVerticalZone = (y: number): 'top' | 'bottom' => {
    return y >= GOAL_ZONES.TOP.min ? 'top' : 'bottom';
};

const calculateSaveProbability = (ballX: number, ballY: number, keeperX: number, keeperY: number, shotPower: number): number => {
    // Distance between ball and goalkeeper
    const distance = Math.sqrt(Math.pow(ballX - keeperX, 2) + Math.pow(ballY - keeperY, 2));
    
    // Base save probability based on shot position
    const horizontalZone = determineHorizontalZone(ballX);
    const verticalZone = determineVerticalZone(ballY);
    
    let baseSaveProbability;
    
    // Determine base save probability
    if (horizontalZone === 'center') {
        baseSaveProbability = verticalZone === 'bottom' ? 
            GOALKEEPER_SAVE_ZONES.CENTER_BOTTOM : 
            GOALKEEPER_SAVE_ZONES.CENTER_TOP;
    } else {
        // Check if it's a corner shot
        if ((horizontalZone === 'left' || horizontalZone === 'right') && 
            (verticalZone === 'top' && ballY > 0.8) || (verticalZone === 'bottom' && ballY < 0.2)) {
            baseSaveProbability = GOALKEEPER_SAVE_ZONES.CORNERS;
        } else {
            baseSaveProbability = verticalZone === 'bottom' ? 
                GOALKEEPER_SAVE_ZONES.SIDE_BOTTOM : 
                GOALKEEPER_SAVE_ZONES.SIDE_TOP;
        }
    }
    
    // Adjust for goalkeeper position (closer goalkeeper has better save chance)
    const positionFactor = 1 - (distance * 0.3);
    
    // Adjust for shot power (more powerful shots are harder to save)
    const powerFactor = 1 - (shotPower * 0.2);
    
    return Math.max(0, Math.min(1, baseSaveProbability * positionFactor * powerFactor));
};

export const generateResult = ({ finalHash, serverSeed }: { finalHash: string; serverSeed: string }): SoccerShotResult => {
    const randomNumbers: number[] = JSON.parse(serverSeed)
        .random.split(";")
        .slice(0, 6) // Need 6 random numbers for complete shot simulation
        .map((x: string) => +x);

    const increments = parseFinalHashToNumbers(finalHash, randomNumbers.length);

    // Generate shot parameters using random numbers + increments
    const ballX = normalizeValue(randomNumbers[0] + increments[0], 0, 255);
    const ballY = normalizeValue(randomNumbers[1] + increments[1], 0, 255);
    const keeperX = normalizeValue(randomNumbers[2] + increments[2], 0, 255);
    const keeperY = normalizeValue(randomNumbers[3] + increments[3], 0, 255);
    const shotPower = normalizeValue(randomNumbers[4] + increments[4], 0, 255);
    const shotAccuracy = normalizeValue(randomNumbers[5] + increments[5], 0, 255);

    // Determine zones
    const horizontalZone = determineHorizontalZone(ballX);
    const verticalZone = determineVerticalZone(ballY);

    // Calculate if goalkeeper saves the shot
    const saveProbability = calculateSaveProbability(ballX, ballY, keeperX, keeperY, shotPower);
    const saveRoll = normalizeValue(randomNumbers[0] + randomNumbers[1] + increments[0], 0, 511);
    const isGoal = saveRoll > saveProbability;

    return {
        ballX,
        ballY,
        keeperX,
        keeperY,
        isGoal,
        horizontalZone,
        verticalZone,
        shotPower,
        shotAccuracy
    };
};

export const getSettlementResult = (roundResult: SoccerShotResult): Record<string, boolean> => {
    return settlementRuleEntries.reduce((result: Record<string, boolean>, [choice, rule]) => {
        result[choice] = rule(roundResult);
        return result;
    }, {});
};

// Export types for use in other files
export type { SoccerShotResult };