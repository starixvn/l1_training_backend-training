import React, { useState, useEffect } from "react";
import styles from "./soccer-plate.module.scss";
import { RoundState } from "../../../components/game-base/type";
import useResult from "../../../_shared/react-hooks/use-result";
import { useGameStateContext } from "../../../_shared/react-contexts/game-state-context/game-state-context";
import { 
    SoccerPinGoalResult, 
    TunnelDisplayNames, 
    OpponentDisplayNames,
    WinProbabilities,
    OddsTable
} from "../soccer-multiplayer-constants";
import { useGameContext } from "../../../_shared/react-contexts";

// 簡化的文字結果顯示組件，不使用複雜動畫
const DISPLAY_DURATION = 5000; // 結果顯示時間
const DELAY = 500; // 延遲顯示時間

type DisplayState = "hidden" | "showing" | "displayed";

const SoccerPlate: React.FC = () => {
    const { durations } = useGameContext();
    const { roundHistory, result, roundState, roundId } = useGameStateContext();
    const [displayState, setDisplayState] = useState<DisplayState>("hidden");
    const [showResult, setShowResult] = useState(false);
    const currentResult = useResult<SoccerPinGoalResult>({ result, roundState, roundHistory });

    // 從結果中提取軌道遊戲數據
    const extractTunnelGameData = (result: SoccerPinGoalResult) => {
        if (!result) return null;
        
        return {
            playerTunnel: result.playerTunnel || 1,
            opponentCount: result.opponentCount || 1,
            playerWin: result.isGoal || false,
            winProbability: WinProbabilities[result.opponentCount || 1] || 0.48,
            odds: OddsTable[result.opponentCount || 1] || 1.8,
            videoUrl: result.videoUrl
        };
    };

    useEffect(() => {
        const resetState = () => {
            setDisplayState("hidden");
            setShowResult(false);
        };
        
        let timeoutDisplayResult: NodeJS.Timeout;
        let timeoutHide: NodeJS.Timeout;
        
        switch (roundState) {
            case RoundState.LockingBet:
                setDisplayState("showing");
                setShowResult(false);
                break;
            case RoundState.DisplayResult:
                timeoutDisplayResult && clearTimeout(timeoutDisplayResult);
                timeoutDisplayResult = setTimeout(() => {
                    setDisplayState("displayed");
                    setShowResult(true);
                    timeoutHide = setTimeout(() => {
                        resetState();
                    }, durations.showResult * 1000);
                }, DELAY);
                break;
            case RoundState.BeforePlaceBet:
            case RoundState.InRound:
                resetState();
                break;
            default:
                break;
        }
        return () => {
            timeoutDisplayResult && clearTimeout(timeoutDisplayResult);
            timeoutHide && clearTimeout(timeoutHide);
        };
    }, [roundState, durations]);

    const renderTunnelGameResult = () => {
        if (!showResult || !currentResult) {
            return null;
        }

        const gameData = extractTunnelGameData(currentResult);
        if (!gameData) return null;

        const { playerTunnel, opponentCount, playerWin, winProbability, odds, videoUrl } = gameData;

        return (
            <div className={`${styles["tunnel-result-display"]} bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto`}>
                <div className="text-center">
                    {/* 遊戲標題 */}
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">
                        🎮 軌道彈珠遊戲
                    </h3>
                    
                    {/* 遊戲配置顯示 */}
                    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-semibold text-blue-600">選擇軌道:</span>
                                <div className="text-lg font-bold">
                                    {TunnelDisplayNames[playerTunnel]}
                                </div>
                            </div>
                            <div>
                                <span className="font-semibold text-purple-600">對手數量:</span>
                                <div className="text-lg font-bold">
                                    {OpponentDisplayNames[opponentCount]}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 遊戲結果 */}
                    <div className={`mb-6 p-6 rounded-lg ${playerWin ? 'bg-green-100 border-2 border-green-400' : 'bg-red-100 border-2 border-red-400'}`}>
                        <div className={`text-4xl font-bold mb-2 ${playerWin ? 'text-green-600' : 'text-red-600'}`}>
                            {playerWin ? '🏆 獲勝!' : '❌ 失敗!'}
                        </div>
                        <div className="text-lg text-gray-700">
                            {playerWin 
                                ? `恭喜！您的珠子在軌道 ${playerTunnel} 中獲勝！` 
                                : `很遺憾，您的珠子在軌道 ${playerTunnel} 中未能獲勝。`
                            }
                        </div>
                    </div>

                    {/* 遊戲統計信息 */}
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">獲勝機率:</span>
                                <div className="text-lg font-semibold text-blue-600">
                                    {(winProbability * 100).toFixed(1)}%
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-600">賠率:</span>
                                <div className="text-lg font-semibold text-green-600">
                                    {odds}x
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 影片信息（demo用） */}
                    {videoUrl && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                            <div className="text-sm text-yellow-800">
                                <span className="font-semibold">📹 影片URL:</span>
                                <div className="break-all text-xs mt-1 font-mono">
                                    {videoUrl}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (displayState === "hidden") {
        return null;
    }

    // 顯示準備階段的提示
    if (displayState === "showing" && !showResult) {
        return (
            <div className="relative w-full flex justify-center items-center min-h-[200px]">
                <div className="bg-blue-100 rounded-lg p-6 text-center">
                    <div className="text-2xl mb-2">🎲</div>
                    <div className="text-lg font-semibold text-blue-800">珠子正在滾動中...</div>
                    <div className="text-sm text-blue-600 mt-2">即將顯示結果</div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full flex justify-center items-center py-4">
            {renderTunnelGameResult()}
        </div>
    );
};

export default SoccerPlate;
