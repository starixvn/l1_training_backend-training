import { SoccerPinGoalResult, SoccerPinGoalSettlementResult } from "../soccer-multiplayer-constants";
import styles from "./style.module.scss";

export const SoccerPinGoalRoundHistoryItem = ({
    result,
    index,
}: {
    result: { result: SoccerPinGoalResult; settlementResult: SoccerPinGoalSettlementResult; roundId: number };
    index: number;
}) => {
    if (!result?.settlementResult) {
        return null;
    }
    // Use win/lose for Soccer PinGoal instead of odd/even
    const isWin = result.settlementResult.win;
    return (
        <div className="w-[18px] h-[18px] inline-flex items-center justify-center" key={index}>
            {isWin ? <WinItem /> : <LoseItem />}
        </div>
    );
};
const WinItem = () => {
    return (
        <div className={`${styles["round-history-item"]} ${styles["win-item"]}`}>
            <div className={styles.text}>W</div>
            <div className={styles.border}></div>
        </div>
    );
};
const LoseItem = () => {
    return (
        <div className={`${styles["round-history-item"]} ${styles["lose-item"]}`}>
            <div className={styles.text}>L</div>
            <div className={styles.border}></div>
        </div>
    );
};
