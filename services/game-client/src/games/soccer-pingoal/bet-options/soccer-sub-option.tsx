import React, { useState } from "react";

type SelectionMode = 'player' | 'opponent';

export const SoccerPinGoalSubBetOptions = ({ tolgeeNamespace }: { tolgeeNamespace: string }) => {
    const [playerTrack, setPlayerTrack] = useState<number | null>(null);
    const [opponentTrack, setOpponentTrack] = useState<number | null>(null);
    const [selectionMode, setSelectionMode] = useState<SelectionMode>('player');

    const handleTrackClick = (track: number) => {
        if (selectionMode === 'player') {
            setPlayerTrack(track);
        } else {
            setOpponentTrack(track);
        }
    };

    return (
        <div className="bg-gray-800 rounded-2xl p-4 mt-2 w-full max-w-[558px]">
            {/* 模式切換按鈕 */}
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

            {/* 軌道選擇 */}
            <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5, 6].map((track) => (
                    <TrackOption
                        key={track}
                        track={track}
                        playerTrack={playerTrack}
                        opponentTrack={opponentTrack}
                        onClick={() => handleTrackClick(track)}
                    />
                ))}
            </div>

            {/* 選擇狀態顯示 */}
            <div className="mt-4 text-center text-sm">
                <div className="flex justify-center items-center gap-4 text-gray-300">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>玩家軌道: {playerTrack || '未選擇'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>對手軌道: {opponentTrack || '未選擇'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface TrackOptionProps {
    track: number;
    playerTrack: number | null;
    opponentTrack: number | null;
    onClick: () => void;
}

const TrackOption: React.FC<TrackOptionProps> = ({ track, playerTrack, opponentTrack, onClick }) => {
    const baseClasses = "w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg cursor-pointer transition-all duration-200 hover:scale-110";
    
    // 判斷軌道狀態
    const isPlayerTrack = playerTrack === track;
    const isOpponentTrack = opponentTrack === track;
    const isUnselected = !isPlayerTrack && !isOpponentTrack;

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
            onClick={onClick}
        >
            {track}
        </div>
    );
};