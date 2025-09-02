import { GameRoundDataHandler } from "../../components/game-base/handlers/game-round-data-handler";

export class SoccerPinGoalGameRoundDataHandler extends GameRoundDataHandler {
    buildGameRoundDataAfterReceiveFinishEvent(previousRoundData: any, result: any, roundId: number) {
        const resultRoundData = {
            goal: result.goal,
            winningTunnel: result.winningTunnel,
            winningChoice: result.winningChoice,
            timestamp: new Date().toISOString(),
            roundId: roundId,
        };

        return {
            goals: previousRoundData?.goals?.concat([resultRoundData.goal]) || [resultRoundData.goal],
            winningTunnel: result.winningTunnel,
            winningChoice: result.winningChoice,
            timestamp: resultRoundData.timestamp,
            roundId: resultRoundData.roundId,
            gameType: 'soccer-pingoal',
            statistics: this.calculateStatistics(previousRoundData, result),
        };
    }

    private calculateStatistics(previousRoundData: any, result: any) {
        const allGoals = previousRoundData?.goals?.concat([result.goal]) || [result.goal];

        const tunnelFrequency: { [key: number]: number } = {};
        if (result.winningTunnel) {
            tunnelFrequency[result.winningTunnel] = (previousRoundData?.statistics?.tunnelFrequency?.[result.winningTunnel] || 0) + 1;
        }

        const winningPatterns = {
            tunnel1: 0,
            tunnel2: 0,
            tunnel3: 0,
            tunnel4: 0,
            tunnel5: 0,
            tunnel6: 0,
            win: 0,
            lose: 0,
        };

        if (previousRoundData?.statistics?.winningPatterns) {
            Object.keys(winningPatterns).forEach(pattern => {
                winningPatterns[pattern] = previousRoundData.statistics.winningPatterns[pattern] || 0;
            });
        }

        if (result.winningChoice) {
            winningPatterns[result.winningChoice] = (winningPatterns[result.winningChoice] || 0) + 1;
        }

        return {
            tunnelFrequency,
            winningPatterns,
            totalRounds: allGoals.length,
            totalGoals: allGoals.filter(goal => goal === true).length,
        };
    }

    validateGameRoundData(roundData: any): boolean {
        if (!roundData) {
            return false;
        }
        const requiredFields = ['goal', 'roundId'];
        for (const field of requiredFields) {
            if (roundData[field] === undefined) {
                return false;
            }
        }
        if (typeof roundData.goal !== 'boolean') {
            return false;
        }
        if (roundData.winningTunnel && (typeof roundData.winningTunnel !== 'number' || roundData.winningTunnel < 1 || roundData.winningTunnel > 6)) {
            return false;
        }
        return true;
    }
}


