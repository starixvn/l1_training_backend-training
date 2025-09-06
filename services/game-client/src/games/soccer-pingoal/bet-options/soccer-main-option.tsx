import dynamic from "next/dynamic";
import styles from "./style.module.scss";
import { SoccerPinGoalBetOptions } from "../soccer-multiplayer-constants";

const Odds = dynamic(() => import("../../../components/game-components/bet-option/odds"));
const OwnBet = dynamic(() => import("../../../components/game-components/bet-option/own-bet"));
const TotalBet = dynamic(() => import("../../../components/game-components/bet-option/total-bet"));
const RippleButton = dynamic(() => import("../../../components/game-components/bet-option/ripple-button"));
const HighlightBetOption = dynamic(() => import("./highlight-bet-option"));
const PrevHighlightBetOption = dynamic(() => import("./highight-prev-round-bet-option"));
const ChipEffect = dynamic(() => import("../../../components/game-components/bet-option/chip-effect"));

// Custom bet choice text mapping
const getCustomBetChoiceText = (choice: string) => {
    switch (choice) {
        case SoccerPinGoalBetOptions.WIN:
            return "Red";
        case SoccerPinGoalBetOptions.LOSE:
            return "Blue";
        case SoccerPinGoalBetOptions.DRAW:
            return "Draw";
        default:
            return choice;
    }
};

export const SoccerPinGoalMainOption = ({ tolgeeNamespace, choice }: { tolgeeNamespace: string; choice: string }) => {
    const choiceStyle = `${styles[choice]} ${styles["main-option"]}`;
    const buttonId = `${tolgeeNamespace}-choice-${choice}`;

    return (
        <div className="relative">
            <div className={` text-white relative w-[116px] h-[138px] flex flex-col justify-around ${choiceStyle} md:w-[148px]`}>
                <TotalBet choice={choice} className={"h-6 pt-1 flex items-center justify-center"} tolgeeNamespace={tolgeeNamespace} />
                <div>
                    <div id={`${tolgeeNamespace}-${choice}-bet-name`} className="text-center text-xl font-bold">
                        {getCustomBetChoiceText(choice)}
                    </div>
                    <Odds choice={choice} tolgeeNamespace={tolgeeNamespace} isFormatOddsAuto={true} className={"text-lg"} />
                </div>
                <div className="h-5">
                    <OwnBet choice={choice} tolgeeNamespace={tolgeeNamespace} />
                </div>
                <RippleButton className={`${styles["btn-ripple"]}`} id={buttonId} choice={choice} />
            </div>
            <ChipEffect choice={choice} />
            <HighlightBetOption choice={choice} />
            <PrevHighlightBetOption choice={choice} />
        </div>
    );
};
