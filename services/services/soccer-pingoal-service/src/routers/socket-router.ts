import { BaseSocketRouter } from "sc-game-base/src/core/routers";
import { RebetConsumer } from "../consumers";
import { generatePinGoalResult } from "../helpers/result-helper";

export default class SocketRouter extends BaseSocketRouter {
    declare rebetConsumer: RebetConsumer;

    constructor(props: any) {
        super(props);
        this.rebetConsumer = props.rebetConsumer;
    }

    init(socketClient: any) {
        console.log(`[SoccerPinGoal SocketRouter] 🔧 Initializing socket for client: ${socketClient.id}`);
        super.init(socketClient);
        
        // Add signin event debugging
        console.log(`[SoccerPinGoal SocketRouter] 📝 Setting up event listeners...`);
        this.socketClient.on("signin", (data) => {
            console.log(`[SoccerPinGoal SocketRouter] 📨 SIGNIN EVENT RECEIVED from client ${socketClient.id}`);
            // console.log(`[SoccerPinGoal SocketRouter] 📨 SIGNIN DATA:`, JSON.stringify(data, null, 2)); // 簡化日誌
        });
        
        this.socketClient.on("rebet", this.handleRebet.bind(this));
        this.socketClient.on("startPinGoalGame", this.handleStartPinGoalGame.bind(this));
        console.log(`[SoccerPinGoal SocketRouter] ✅ Socket initialization completed for client: ${socketClient.id}`);
    }

    handleRebet(payload: any) {
        try {
            if (!this.verify()) {
                return;
            }
            this.rebetConsumer.consume(this.gameData.realPlayers[this.socketClient.id], payload);
        } catch (error) {
            this.logService.logError(error);
        }
    }

    async handleStartPinGoalGame(payload: any) {
        try {
            console.log(`[SoccerPinGoal SocketRouter] 🎮 Start PinGoal Game request from client ${this.socketClient.id}`, payload);
            
            if (!this.verify()) {
                console.log(`[SoccerPinGoal SocketRouter] ❌ Client verification failed`);
                return;
            }

            const { playerTrack, opponentTrack, gameType } = payload;
            
            // 驗證輸入參數
            if (!playerTrack || !opponentTrack || 
                playerTrack < 1 || playerTrack > 6 || 
                opponentTrack < 1 || opponentTrack > 6) {
                console.log(`[SoccerPinGoal SocketRouter] ❌ Invalid track parameters:`, { playerTrack, opponentTrack });
                this.socketClient.emit('error', { message: 'Invalid track parameters' });
                return;
            }

            if (playerTrack === opponentTrack) {
                console.log(`[SoccerPinGoal SocketRouter] ❌ Player and opponent cannot choose same track`);
                this.socketClient.emit('error', { message: 'Player and opponent cannot choose same track' });
                return;
            }

            // 開始 PinGoal 遊戲處理
            const player = this.gameData.realPlayers[this.socketClient.id];
            await this.startPinGoalGame(player, { playerTrack, opponentTrack });

        } catch (error) {
            console.error(`[SoccerPinGoal SocketRouter] ❌ Error in handleStartPinGoalGame:`, error);
            this.logService.logError(error);
            this.socketClient.emit('error', { message: 'Game start failed' });
        }
    }

    private async startPinGoalGame(player: any, gameParams: { playerTrack: number, opponentTrack: number }) {
        const { playerTrack, opponentTrack } = gameParams;
        
        console.log(`[SoccerPinGoal SocketRouter] 🎯 Starting PinGoal game for player ${player.uid}:`, gameParams);

        // 模擬遊戲延遲（2秒後發送結果）
        setTimeout(async () => {
            try {
                // 生成遊戲結果
                const gameResult = await this.generatePinGoalResult(playerTrack, opponentTrack);
                
                console.log(`[SoccerPinGoal SocketRouter] 🏆 Game result generated:`, gameResult);

                // 發送結果到客戶端
                this.socketClient.emit('soccer-pingoal', {
                    finish: {
                        result: gameResult,
                        settlementResult: this.getSettlementResult(gameResult),
                        roundId: Date.now(), // 暫時使用時間戳作為 roundId
                    }
                });

            } catch (error) {
                console.error(`[SoccerPinGoal SocketRouter] ❌ Error generating game result:`, error);
                this.socketClient.emit('error', { message: 'Game result generation failed' });
            }
        }, 2000);
    }

    private async generatePinGoalResult(playerTrack: number, opponentTrack: number) {
        // 使用 result-helper 中的專門函數
        const result = generatePinGoalResult({
            playerTrack,
            opponentTrack
        });

        return {
            playerTrack,
            opponentTrack,
            playerWin: result.playerWin,
            playerScore: result.playerScore,
            opponentScore: result.opponentScore,
            randomValue: result.randomValue,
            videoUrl: result.videoUrl
        };
    }

    private getSettlementResult(gameResult: any) {
        return {
            [`tunnel${gameResult.playerTrack}`]: true,
            [`opponent${gameResult.opponentTrack}`]: true,
            win: gameResult.playerWin === true,
            lose: gameResult.playerWin === false,
            draw: gameResult.playerWin === null
        };
    }
}
