export default {
    id: 200,
    name: "SoccerPinGoal",
    durations: {
        wholeRound: 35,
        placingBets: 25,
        lockingBet: 3,
        preparation: 3,
        videoPlaying: 5,
        settlement: 2,
    },
    choices: ["win", "draw", "lose", "tunnel1", "tunnel2", "tunnel3", "tunnel4", "tunnel5", "tunnel6", "opponent1", "opponent2", "opponent3", "opponent4", "opponent5"],
    choicesMapper: { 
        win: 1, draw: 2, lose: 3, 
        tunnel1: 4, tunnel2: 5, tunnel3: 6, tunnel4: 7, tunnel5: 8, tunnel6: 9,
        opponent1: 10, opponent2: 11, opponent3: 12, opponent4: 13, opponent5: 14
    },
    hedgeBetGroups: [["win", "lose"]],
    provablyFair: true,
};
