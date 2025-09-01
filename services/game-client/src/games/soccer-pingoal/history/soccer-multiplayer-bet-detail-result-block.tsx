import { FC } from "react";
import Image from "next/image";

import { useGameContext } from "../../../_shared/react-contexts";
import { useCommonTranslate, useTranslator } from "../../../_shared/react-hooks";
import { DrawInfo } from "../../../components/game-base/type";
import { SoccerPinGoalBetOptions } from "../soccer-multiplayer-constants";

export interface RoundInfoSeDie extends DrawInfo {
    roundId: number;
    result: {
        balls?: Array<number>;
    } | Record<string, boolean>;
    odds: Record<string, number>;
    settlementResult: Record<string, boolean>;
}

const SUB_OPTIONS = [
    SoccerPinGoalBetOptions.tunnel1,
    SoccerPinGoalBetOptions.tunnel2,
    SoccerPinGoalBetOptions.tunnel3,
    SoccerPinGoalBetOptions.tunnel4,
    SoccerPinGoalBetOptions.tunnel5,
    SoccerPinGoalBetOptions.tunnel6,
    SoccerPinGoalBetOptions.opponent1,
    SoccerPinGoalBetOptions.opponent2,
    SoccerPinGoalBetOptions.opponent3,
    SoccerPinGoalBetOptions.opponent4,
    SoccerPinGoalBetOptions.opponent5,
] as const;

const SUB_COLORS = [
    SoccerPinGoalBetOptions.WIN,
    SoccerPinGoalBetOptions.LOSE,
];

const IMAGE_SIZE = 30;

export const getWinningSubOption = (settlementResult: Record<string, boolean>): string => {
    return SUB_OPTIONS.find(option => settlementResult[option]) || '';
};

const calculateWin = (isWin: boolean, amount: number, odds: number): number => {
    return isWin ? amount * odds : 0;
};

export const BetDetailResultBlock: FC<{ roundInfo: RoundInfoSeDie }> = ({ roundInfo: drawInfo }) => {
    const { t: translateCommon } = useCommonTranslate();
    const { roundId, settlementResult } = drawInfo;

    const winningSubOption = getWinningSubOption(settlementResult);
    const winningColor = SUB_COLORS.find(color => settlementResult[color]) || '';

    return (
        <div className="flex justify-between text-secondary-text text-[14px] mt-2">
            <div className="flex items-center gap-1.5 font-medium">
                {translateCommon("round").capitalizeFirstLetter()}: <span>{roundId}</span>
            </div>
            <div className="flex items-center gap-1.5">
                {winningSubOption || winningColor ? (
                    <span className="flex items-center gap-1.5">
                        <span className="text-secondary-text">Result</span>
                        {winningColor && (
                            <span className={`px-2 py-1 rounded text-white text-xs ${
                                winningColor === SoccerPinGoalBetOptions.WIN ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                                {winningColor === SoccerPinGoalBetOptions.WIN ? '勝' : '敗'}
                            </span>
                        )}
                        {winningSubOption && (
                            <span className="px-2 py-1 rounded bg-blue-500 text-white text-xs">
                                {winningSubOption.replace('tunnel', 'T').replace('opponent', 'O')}
                            </span>
                        )}
                    </span>
                ) : (
                    <span aria-label="no result">—</span>
                )}
            </div>
        </div>
    );
};

export const produceDataBetDetailRow = (item: any, drawInfo: RoundInfoSeDie) => {
    const win = calculateWin(
        drawInfo.settlementResult?.[item.choice],
        item.amount,
        drawInfo.odds[item.choice]
    );

    return {
        rawTime: item.time,
        amount: item.amount,
        choice: item.choice,
        odds: drawInfo.odds[item.choice],
        win,
        hightlight: drawInfo.settlementResult?.[item.choice],
    };
};

export const BetChoice: FC<{ choice: string }> = ({ choice }) => {
    const { tolgeeNamespace } = useGameContext();
    const { t } = useTranslator([tolgeeNamespace || ""]);

    // 處理新的軌道彈珠遊戲選項
    if (choice.startsWith('tunnel')) {
        return (
            <span className="font-text flex justify-center items-center px-2 py-1 bg-blue-100 rounded text-blue-800">
                軌道 {choice.replace('tunnel', '')}
            </span>
        );
    }

    if (choice.startsWith('opponent')) {
        return (
            <span className="font-text flex justify-center items-center px-2 py-1 bg-purple-100 rounded text-purple-800">
                {choice.replace('opponent', '')}對手
            </span>
        );
    }

    if (choice === SoccerPinGoalBetOptions.WIN) {
        return (
            <span className="font-text flex justify-center items-center px-2 py-1 bg-green-100 rounded text-green-800">
                勝
            </span>
        );
    }

    if (choice === SoccerPinGoalBetOptions.LOSE) {
        return (
            <span className="font-text flex justify-center items-center px-2 py-1 bg-red-100 rounded text-red-800">
                敗
            </span>
        );
    }

    // 向後兼容舊的足球選項
    if (choice === SoccerPinGoalBetOptions.GOAL) {
        return (
            <span className="font-text flex justify-center items-center px-2 py-1 bg-green-100 rounded text-green-800">
                進球
            </span>
        );
    }

    if (choice === SoccerPinGoalBetOptions.MISS) {
        return (
            <span className="font-text flex justify-center items-center px-2 py-1 bg-red-100 rounded text-red-800">
                失球
            </span>
        );
    }

    // 默認顯示
    return (
        <span className="font-text flex justify-center items-center">
            {t(`glossary_${choice}`) || choice}
        </span>
    );
};