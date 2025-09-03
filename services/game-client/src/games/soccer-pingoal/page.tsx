import { withRouter } from "next/router";
import { JSX, lazy } from "react";

import { useSystemContext, useSystemDispatch } from "../../_shared/react-contexts";
import {
    GameStateProvider,
    useGameStateContext,
    useGameStatesDispatch,
} from "../../_shared/react-contexts/game-state-context/game-state-context";
import { useTranslator } from "../../_shared/react-hooks";
import GameBase from "../../components/game-base/";
import { GameMessageHandler } from "../../components/game-base/handlers";
import { GameBaseHandlers, GameBaseProps, GameBaseState } from "../../components/game-base/type";
import { RoundGameSoundHandler } from "../../components/round-base/round-game-sound-handler";
import { RoundIdHandler } from "../../components/round-base/round-id-handler";
import { RoundStateHandler } from "../../components/round-base/round-state-handler";
import { SoccerPinGoalBetOptions } from "./soccer-multiplayer-constants";
import { SoccerPinGoalGameRoundDataHandler } from "./soccer-multiplayer-game-round-data-handler";
import SoccerPlate from "./result-block/soccer-plate";
import SoccerPinGoalMultiplayerBettingBlock from "./soccer-multiplayer-betting-block";
import { SoccerMultiplayerRoundHistory } from "./round-history/soccer-multiplayer-round-history";
import { SoccerMultiplayerStatisticPopup } from "./round-history/soccer-multiplayer-statistic-popup";
import SoccerPinGoalMultiplayerBetDetailModal from "./history";
const OwnTotalBet = lazy(() => import("../../components/game-components/own-total-bet/own-total-bet"));
const DoubleBetIcon = lazy(() => import("../../components/game-components/rebet/double-bet-icon"));
const AutoRebetIcon = lazy(() => import("../../components/game-components/rebet/auto-rebet-icon"));

export type SoccerPinGoalState = {
    statisticGroup?: number;
    showStatistic?: boolean;
} & GameBaseState;

class SoccerPinGoalMultiPlayer extends GameBase<GameBaseProps, SoccerPinGoalState> {
    state: SoccerPinGoalState = { statisticGroup: 0, isLoaded: false, showStatistic: false };
    private readonly roundIdHandler?: RoundIdHandler;

    constructor(props: GameBaseProps) {
        const gameMessageHandler = new GameMessageHandler(props.dispatch);
        const gameBaseHandlers: GameBaseHandlers = {
            roundStateHandler: new RoundStateHandler(),
            gameMessageHandler: gameMessageHandler,
            gameRoundDataHandler: new SoccerPinGoalGameRoundDataHandler(),
            gameSoundHandler: new RoundGameSoundHandler({ gameSound: () => props.gameSound }),
        };
        super(props, gameBaseHandlers);

        this.roundIdHandler = new RoundIdHandler({
            dispatch: props.dispatch,
            gameStateContextModel: this.getGameStateContext.bind(this),
            gameMessageHandler,
            durations: props.durations,
            pfSeedBy: "roundId",
        });
    }

    override registerHandlers(): void {
        super.registerHandlers();
        this.roundIdHandler?.registerEvents();
    }

    componentDidMount() {
        super.componentDidMount();
    }

    private readonly openStatistic = () => this.setState({ showStatistic: true });

    private readonly closeStatistic = () => this.setState({ showStatistic: false });

    renderRoundHistory(): JSX.Element {
        const { showStatistic } = this.state;
        return (
            <div className="my-3">
                {showStatistic ? (
                    <SoccerMultiplayerStatisticPopup inline onClose={this.closeStatistic} />
                ) : (
                    <SoccerMultiplayerRoundHistory onOpenStatistic={this.openStatistic} />
                )}
            </div>
        );
    }

    renderResultBlock() {
        return <SoccerPlate />;
    }

    renderBettingBlock() {
        return <SoccerPinGoalMultiplayerBettingBlock />;
    }

    renderBetControl() {
        return (
            <div className="relative md:bg-primary-bg md:rounded-t-xl">
                <div className="grid grid-cols-12 gap-0 items-center">
                    <div className="col-span-12 md:col-span-6">
                        <div className="flex gap-2 justify-center items-center">
                            <div className="md:absolute md:right-[10px] md:top-[-200px]">
                                <DoubleBetIcon />
                            </div>
                            {this.renderChipControlPanel()}
                            <div className="md:absolute md:right-[10px] md:top-[-134px] md:w-full md:h-full">
                                <div className="md:flex md:justify-end">
                                    <AutoRebetIcon />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-6">
                        <div className="p-3 rounded-t-xl bg-primary-bg">
                            <OwnTotalBet />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderBetDetailModal() {
        return <SoccerPinGoalMultiplayerBetDetailModal />;
    }

    getRenderTemplate() {
        return (
            <div className="game-template">
                {this.renderRoundHistory()}
                {this.renderResultBlock()}
                {this.renderBettingBlock()}
                {this.renderBetControl()}
            </div>
        );
    }
}

const SoccerPinGoalWrapper = (props) => {
    return (
        <GameStateProvider>
            <SoccerPinGoalFC {...props} />
        </GameStateProvider>
    );
};

const SoccerPinGoalFC = (props) => {
    const tolgeeNamespace = props["tolgeeNamespace"];
    const { t } = useTranslator([tolgeeNamespace]);

    return (
        <SoccerPinGoalMultiPlayer
            {...props}
            {...{
                dispatch: useGameStatesDispatch(),
                gameStateContextModel: useGameStateContext(),
                systemContextModel: useSystemContext(),
                systemDispatch: useSystemDispatch(),
                translate: t,
                tolgeeNamespace,
                hedgeBetGroups: [
                    [SoccerPinGoalBetOptions.WIN, SoccerPinGoalBetOptions.LOSE],
                    // 保留舊的對沖組以向後兼容
                    [SoccerPinGoalBetOptions.GOAL, SoccerPinGoalBetOptions.MISS]
                ],
            }}
        />
    );
};

export default withRouter(SoccerPinGoalWrapper);
