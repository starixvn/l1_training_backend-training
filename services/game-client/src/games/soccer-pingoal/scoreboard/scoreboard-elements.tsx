import { ReactNode } from "react";
import { Converter } from "sc-scoreboards";

import { BigRoadElement, BigRoadRound } from "../../../components/game-components/round-history/scoreboard/elements";
import { registerBigRoadElement } from "../../../_shared/helpers/scoreboard-registry";
import { GameIds } from "../../../_shared/constants";
import styles from "./scoreboard-elements.module.scss";
import dotStyles from "../../../components/game-components/round-history/dot/dot.module.scss";
import { SoccerPinGoalBetOptions, SoccerPinGoalSettlementResult } from "../soccer-multiplayer-constants";

export class SoccerPinGoalBigRoadConverter extends Converter<SoccerPinGoalSettlementResult> {
    static addBlinkNode(rounds: SoccerPinGoalSettlementResult[]) {
        const lastRound = rounds.find((round) => round.win || round.lose);

        const blinkRound = {
            win: lastRound?.win,
            lose: undefined,
            roundId: 0,
        } as any;

        rounds.unshift(blinkRound);
    }

    static readonly instance = new SoccerPinGoalBigRoadConverter();

    protected positiveKey(): string {
        return SoccerPinGoalBetOptions.WIN;
    }

    protected specialKey(): string {
        return "";
    }
}

export class SoccerPinGoalBigRoadElement extends BigRoadElement<SoccerPinGoalSettlementResult> {
    renderElement(round: BigRoadRound<SoccerPinGoalSettlementResult>): ReactNode {
        const win = round.data.some((result) => result.win);
        const lose = round.data.some((result) => result.lose);
        const isBlinkNode = round.data.some((result) => result.lose === undefined || result.win === undefined);

        if (isBlinkNode) {
            return <span className={`${dotStyles["dot-next"]} ${dotStyles["blink"]}`}></span>;
        } else if (win) {
            return <span className={styles.green}></span>;
        } else if (lose) {
            return <span className={styles.red}></span>;
        } else {
            return <></>;
        }
    }
}

// Register for SoccerPinGoal only
registerBigRoadElement(SoccerPinGoalBigRoadElement, SoccerPinGoalBigRoadConverter as any, GameIds.SoccerPinGoal);


