import dynamic from "next/dynamic";
import { FC } from "react";

import SoccerPinGoalBetOptionsComponent from "./bet-options/soccer-multiplayer-bet-options";

const WinningBalanceEffect = dynamic(() => import("../../components/game-components/balance-effect/winning-balance-effect"));

const SoccerPinGoalMultiplayerBettingBlock: FC = () => {
    return (
        <div className="relative">
            <SoccerPinGoalBetOptionsComponent />
            <WinningBalanceEffect />
        </div>
    );
};

export default SoccerPinGoalMultiplayerBettingBlock;
