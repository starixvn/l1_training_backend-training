// useState import removed as it's not used

import { useGameContext } from "../../../_shared/react-contexts";
import { SoccerPinGoalBetOptions } from "../soccer-multiplayer-constants";
import { SoccerPinGoalSubBetOptions } from "./soccer-sub-option";
import { SoccerPinGoalMainOption } from "./soccer-main-option";

const SoccerPinGoalBetOptionsComponent = () => {
    const { tolgeeNamespace } = useGameContext();

    return (
        <>
            <SoccerPinGoalSubBetOptions tolgeeNamespace={tolgeeNamespace} />
            <div className="flex justify-between my-2 md:mb-6 gap-2">
                <SoccerPinGoalMainOption tolgeeNamespace={tolgeeNamespace} choice={SoccerPinGoalBetOptions.WIN} />
                <SoccerPinGoalMainOption tolgeeNamespace={tolgeeNamespace} choice={SoccerPinGoalBetOptions.DRAW} />
                <SoccerPinGoalMainOption tolgeeNamespace={tolgeeNamespace} choice={SoccerPinGoalBetOptions.LOSE} />
            </div>
        </>
    );
};

export default SoccerPinGoalBetOptionsComponent;
