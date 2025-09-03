import React from "react";
import ScoreboardSoccerPinGoal from "../scoreboard/scoreboard";
import { mainChoices, SoccerPinGoalChoices, SoccerPinGoalStatisticColors, tunnelChoices } from "../soccer-multiplayer-constants";
import PercentageStatistic from "../../../components/game-components/statistic";
import Image from "next/image";
import useGameStore from "../../../_shared/stores/game-store/game-store";
import { useShallow } from "zustand/react/shallow";
import Styles from "./statistic-popup.module.scss";
import AnimatedContent from "../../../components/game-components/animations/animated-content";

interface SoccerMultiplayerStatisticPopupProps {
    onClose?: () => void;
    inline?: boolean;
}

export const SoccerMultiplayerStatisticPopup: React.FC<SoccerMultiplayerStatisticPopupProps> = ({ onClose, inline }) => {
    const { roundHistory, isShowBlink } = useGameStore(
        useShallow((state) => ({ roundHistory: state.roundHistory, isShowBlink: state.isShowBlink }))
    );

    const sideChoices = tunnelChoices;

    const [isClosing, setIsClosing] = React.useState(false);

    const handleClose = () => {
        if (!inline) {
            onClose?.();
            return;
        }
        setIsClosing(true);
        // Match closing animation duration (200ms)
        setTimeout(() => onClose?.(), 200);
    };

    let containerClassName = Styles["statistic-container"];
    if (inline) {
        containerClassName = Styles["inlineContainer"];
    }

    let panelAnimClass = "";
    if (inline) {
        panelAnimClass = isClosing ? Styles["closing"] : Styles["opening"];
    }

    return (
        <div id="statistic-popup" data-testid="statistic-popup" className={containerClassName}>
            <AnimatedContent distance={24} duration={0.8} ease="power3.out" initialOpacity={0} animateOpacity>
                <div
                    className={`${Styles["panel"]} ${panelAnimClass}`}
                    style={{
                        ["--anim-distance" as any]: "-16px",
                        ["--anim-duration" as any]: "480ms",
                        ["--anim-close-duration" as any]: "500ms",
                        ["--anim-ease" as any]: "cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                >
                    <div className={Styles["grid"]}>
                        <button type="button" className={Styles["close"]} onClick={handleClose} aria-label="Close" />
                        <PercentageStatistic
                            roundHistory={roundHistory as any}
                            mainChoices={sideChoices as any}
                            iconRenderer={(choice) => {
                                const map = {
                                    tunnel1: "/static/images/soccer-pingoal/statistic-icon-tunnel1.webp",
                                    tunnel2: "/static/images/soccer-pingoal/statistic-icon-tunnel2.webp",
                                    tunnel3: "/static/images/soccer-pingoal/statistic-icon-tunnel3.webp",
                                    tunnel4: "/static/images/soccer-pingoal/statistic-icon-tunnel4.webp",
                                    tunnel5: "/static/images/soccer-pingoal/statistic-icon-tunnel5.webp",
                                    tunnel6: "/static/images/soccer-pingoal/statistic-icon-tunnel6.webp",
                                } as Record<string, string>;
                                const src = map[choice];
                                return src ? <Image src={src} alt={choice} width={16} height={16} /> : null;
                            }}
                        />
                        <PercentageStatistic
                            roundHistory={roundHistory as any}
                            mainChoices={mainChoices as any}
                            renderAsBar={true}
                            barColors={SoccerPinGoalStatisticColors}
                            barHeightPx={12}
                            roundedRadiusPx={12}
                            barLabelFontSizePx={14}
                        />
                        <ScoreboardSoccerPinGoal roundHistory={roundHistory as any} isShowBlink={isShowBlink} />
                    </div>
                </div>
            </AnimatedContent>
        </div>
    );
};
