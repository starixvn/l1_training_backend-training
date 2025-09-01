// useState import removed as it's not used

import { useGameContext } from "../../../_shared/react-contexts";
import { SoccerPinGoalBetOptions } from "../soccer-multiplayer-constants";
import { SedieMultiplayerSubBetOptions } from "./soccer-sub-option";
import { SedieMultiplayerMainOption } from "./soccer-main-option";

const SeDieMultiplayerBetOptions = () => {
    const { tolgeeNamespace } = useGameContext();

    return (
        <>
            <SedieMultiplayerSubBetOptions tolgeeNamespace={tolgeeNamespace} />
            <div className="flex justify-between my-2 md:mb-6">
                <SedieMultiplayerMainOption tolgeeNamespace={tolgeeNamespace} choice={SoccerPinGoalBetOptions.WIN} />
                <SedieMultiplayerMainOption tolgeeNamespace={tolgeeNamespace} choice={SoccerPinGoalBetOptions.LOSE} />
            </div>
        </>
    );
};

export default SeDieMultiplayerBetOptions;
