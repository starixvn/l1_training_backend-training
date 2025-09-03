import React from "react";
import { useMemoriedImage } from "../../_shared/react-hooks";
import { isHighLightWinningResult } from "../../_shared/react-hooks/use-high-light";
import { RoundState } from "../../components/game-base/type";
import { Spritesheet } from "../../components/game-components/sprites-sheet";
import { SoccerPinGoalBetOptions } from "./soccer-multiplayer-constants";
import Styles from "./soccer-multiplayer.module.scss";

type Props = {
    choice: string;
    resourceName: string;
    className?: string;
    roundState: RoundState;
    settlementResult: any;
    showResultInfo: any;
};

const ChoiceWinningSize = {
    [SoccerPinGoalBetOptions.WIN]: [186, 104],
    [SoccerPinGoalBetOptions.LOSE]: [186, 104],
    [SoccerPinGoalBetOptions.tunnel1]: [146, 74],
    [SoccerPinGoalBetOptions.tunnel2]: [146, 74],
    [SoccerPinGoalBetOptions.tunnel3]: [146, 74],
    [SoccerPinGoalBetOptions.tunnel4]: [146, 74],
    [SoccerPinGoalBetOptions.tunnel5]: [146, 74],
    [SoccerPinGoalBetOptions.tunnel6]: [146, 74],
};

const SoccerPinGoalWinningAnimation: React.FC<Props> = ({ choice, resourceName, roundState, settlementResult, showResultInfo }) => {
    const winningHighLightResult = isHighLightWinningResult;
    const [width, height] = ChoiceWinningSize[choice] || [146, 74];

    const imagePath = `/static/images/soccer-pingoal/highlight-winning-${resourceName}.png`;
    const { data } = useMemoriedImage(imagePath);

    if (!data) {
        return <></>;
    }

    return (
        winningHighLightResult({ betChoice: choice, roundState, settlementResult, showResultInfo }) && (
            <div className="d-grid">
                <Spritesheet
                    className={`${Styles["winning-light-anim"]} ${Styles["anim-" + choice]}`}
                    imageData={data}
                    widthFrame={width}
                    isResponsive
                    heightFrame={height}
                    steps={10}
                    autoplay={true}
                    loop={true}
                    fps={20}
                    startAt={0}
                    endAt={29}
                />

                <div className={`highlight-winning-bg-anim ${Styles["highlight-winning-bg-" + resourceName]}`}></div>
            </div>
        )
    );
};

export default SoccerPinGoalWinningAnimation;
