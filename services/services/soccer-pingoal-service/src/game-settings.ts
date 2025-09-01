import { BET_CHOICES } from "./constants";

export default {
    id: 200,
    name: "SoccerPinGoal",
    durations: {
        wholeRound: 30,
        placingBets: 25,
        lockingBet: 3,
        shotAnimationDuration: 2,
    },
    choices: Object.values(BET_CHOICES),
    choicesMapper: { goal: 1, miss: 2, left: 3, right: 4, center: 5, top: 6, bottom: 7 },
    hedgeBetGroups: [[BET_CHOICES.goal, BET_CHOICES.miss], [BET_CHOICES.left, BET_CHOICES.center, BET_CHOICES.right], [BET_CHOICES.top, BET_CHOICES.bottom]],
    numberOfRoundHistory: 100,
    historyPageSize: 10,
    provablyFair: true,
    botSettings: {
        ratio: { mainOption: 70, sideOption: 30 },
        mainOption: [BET_CHOICES.goal, BET_CHOICES.miss],
        sideOption: [BET_CHOICES.left, BET_CHOICES.right, BET_CHOICES.center, BET_CHOICES.top, BET_CHOICES.bottom],
    },
};
