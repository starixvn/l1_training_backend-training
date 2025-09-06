import React, { useState } from "react";

type SelectionMode = 'player' | 'opponent';
type GameState = 'selection' | 'playing' | 'result';
type GameResult = 'Red' | 'Blue' | 'Draw';

export const SoccerPinGoalSubBetOptions = ({ tolgeeNamespace }: { tolgeeNamespace: string }) => {
    const [playerTrack, setPlayerTrack] = useState<number | null>(null);
    const [opponentTrack, setOpponentTrack] = useState<number | null>(null);
    const [selectionMode, setSelectionMode] = useState<SelectionMode>('player');
    const [gameState, setGameState] = useState<GameState>('selection');
    const [gameResult, setGameResult] = useState<GameResult | null>(null);

    const handleTrackClick = (track: number) => {
        if (gameState !== 'selection') return; // 只有在選擇模式才能點擊
        
        if (selectionMode === 'player') {
            setPlayerTrack(track);
        } else {
            setOpponentTrack(track);
        }
    };

    const handleStartGame = () => {
        if (!playerTrack || !opponentTrack) return; // 必須選擇兩個軌道才能開始
        
        setGameState('playing');
        
        // 模擬遊戲進行（未來這裡會播放影片）
        setTimeout(() => {
            // 隨機產生遊戲結果
            const results: GameResult[] = ['Red', 'Blue', 'Draw'];
            const randomResult = results[Math.floor(Math.random() * results.length)];
            setGameResult(randomResult);
            setGameState('result');
        }, 2000); // 2秒後顯示結果
    };

    const handleRestart = () => {
        setGameState('selection');
        setGameResult(null);
        setPlayerTrack(null);
        setOpponentTrack(null);
        setSelectionMode('player');
    };

    const isReadyToStart = playerTrack !== null && opponentTrack !== null;

    return (
        <div className="bg-gray-800 rounded-2xl p-4 mt-2 w-full max-w-[558px]">
            {/* 遊戲結果顯示 */}
            {gameState === 'result' && (
                <div className="mb-4 text-center">
                    <div className="text-2xl font-bold mb-2 text-white">🎯 遊戲結果</div>
                    <div 
                        className={`text-4xl font-bold py-4 px-8 rounded-xl inline-block ${
                            gameResult === 'Red' 
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                                : gameResult === 'Blue'
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                        }`}
                    >
                        {gameResult} 獲勝！
                    </div>
                </div>
            )}

            {/* 遊戲進行中顯示 */}
            {gameState === 'playing' && (
                <div className="mb-4 text-center">
                    <div className="text-xl font-bold text-white mb-4">🎮 遊戲進行中...</div>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                </div>
            )}

            {/* 模式切換按鈕 - 只在選擇模式顯示 */}
            {gameState === 'selection' && (
                <div className="flex gap-2 mb-4 justify-center">
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                            selectionMode === 'player'
                                ? 'bg-red-500 text-white shadow-lg'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        onClick={() => setSelectionMode('player')}
                    >
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        選擇玩家軌道
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                            selectionMode === 'opponent'
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        onClick={() => setSelectionMode('opponent')}
                    >
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        選擇對手軌道
                    </button>
                </div>
            )}

            {/* 軌道選擇 */}
            <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5, 6].map((track) => (
                    <TrackOption
                        key={track}
                        track={track}
                        playerTrack={playerTrack}
                        opponentTrack={opponentTrack}
                        gameState={gameState}
                        onClick={() => handleTrackClick(track)}
                    />
                ))}
            </div>

            {/* 選擇狀態顯示 */}
            <div className="mt-4 text-center text-sm">
                <div className="flex justify-center items-center gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>玩家軌道: {playerTrack || '未選擇'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>對手軌道: {opponentTrack || '未選擇'}</span>
                    </div>
                </div>

                {/* Start 按鈕和重新開始按鈕 */}
                <div className="flex justify-center gap-2">
                    {gameState === 'selection' && (
                        <button
                            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 ${
                                isReadyToStart
                                    ? 'bg-green-500 text-white shadow-lg hover:bg-green-600 hover:shadow-xl hover:scale-105'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                            onClick={handleStartGame}
                            disabled={!isReadyToStart}
                        >
                            🚀 Start Game
                        </button>
                    )}
                    
                    {gameState === 'result' && (
                        <button
                            className="px-6 py-3 rounded-lg font-bold text-lg bg-purple-500 text-white shadow-lg hover:bg-purple-600 hover:shadow-xl hover:scale-105 transition-all duration-200"
                            onClick={handleRestart}
                        >
                            🔄 重新開始
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

interface TrackOptionProps {
    track: number;
    playerTrack: number | null;
    opponentTrack: number | null;
    gameState: GameState;
    onClick: () => void;
}

const TrackOption: React.FC<TrackOptionProps> = ({ track, playerTrack, opponentTrack, gameState, onClick }) => {
    const isDisabled = gameState !== 'selection';
    const baseClasses = `w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all duration-200 ${
        isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-110'
    }`;
    
    // 判斷軌道狀態
    const isPlayerTrack = playerTrack === track;
    const isOpponentTrack = opponentTrack === track;

    let colorClasses = "";
    let textColor = "";

    if (isPlayerTrack) {
        // 玩家軌道：紅色
        colorClasses = "bg-red-500 border-red-400 shadow-lg shadow-red-500/30";
        textColor = "text-white";
    } else if (isOpponentTrack) {
        // 對手軌道：藍色
        colorClasses = "bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/30";
        textColor = "text-white";
    } else {
        // 未選擇：與背景同色
        colorClasses = "bg-gray-800 border-gray-600";
        textColor = "text-gray-600";
    }

    return (
        <div 
            className={`${baseClasses} ${colorClasses} ${textColor}`}
            onClick={isDisabled ? undefined : onClick}
        >
            {track}
        </div>
    );
};