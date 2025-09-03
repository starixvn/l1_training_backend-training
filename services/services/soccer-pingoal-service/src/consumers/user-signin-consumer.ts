import { Table } from "sc-game-base";
import { PlayerResultBoardManager } from "../helpers";
import { PlayerResultBoardPublisher } from "../publishers";
import { TableGameDefinition } from "sc-game-base/src/table";
import GameData from "../game-data";
import { TableUserSignInPublisher } from "sc-game-base/src/table/event-publishers";
import GameManagementApiClientFactory from "sc-game-base/src/core/game-management-api";
import { PlayGamePermissionValidator } from "sc-game-base/src/core/validators";
import { Socket } from "socket.io";

export default class UserSigninConsumer extends Table.EventConsumers.TableUserSignInConsumer {
    private readonly playerResultBoardPublisher: PlayerResultBoardPublisher;
    private readonly playerResultBoardManager: PlayerResultBoardManager;

    // eslint-disable-next-line sonarjs/max-params
    constructor(
        definition: TableGameDefinition,
        gameData: GameData,
        userSignInPublisher: TableUserSignInPublisher,
        playGamePermissionValidator: PlayGamePermissionValidator,
        appConfigs: Object,
        gameManagementApiClientFactory: GameManagementApiClientFactory,
        playerResultBoardPublisher: PlayerResultBoardPublisher,
        playerResultBoardManager: PlayerResultBoardManager
    ) {
        super(definition, gameData, userSignInPublisher, playGamePermissionValidator, appConfigs, gameManagementApiClientFactory);
        this.playerResultBoardPublisher = playerResultBoardPublisher;
        this.playerResultBoardManager = playerResultBoardManager;
    }

    consume(player: any, payload: any) {
        console.log(`[SoccerPinGoal UserSigninConsumer] 🚀 consume() called with player:`, player?.id || 'unknown');
        console.log(`[SoccerPinGoal UserSigninConsumer] 🔍 payload.system:`, payload?.system);
        console.log(`[SoccerPinGoal UserSigninConsumer] 🔍 gameData.gameConfigs:`, JSON.stringify(this.gameData.gameConfigs, null, 2));
        console.log(`[SoccerPinGoal UserSigninConsumer] 🔍 gameData.delayStartTime:`, this.gameData.delayStartTime);
        
        // Check the condition that determines if game is disabled
        const configs = this.gameData.gameConfigs;
        const configuredlyDisabled = !configs || !configs.enabled;
        const disabled = configuredlyDisabled || this.gameData.delayStartTime > 0;
        
        console.log(`[SoccerPinGoal UserSigninConsumer] 🔍 configuredlyDisabled:`, configuredlyDisabled);
        console.log(`[SoccerPinGoal UserSigninConsumer] 🔍 disabled:`, disabled);
        console.log(`[SoccerPinGoal UserSigninConsumer] 🔍 Will call super.consume:`, !disabled || payload?.system === 2 || payload?.system === 3);
        
        
        
        super.consume(player, payload);
        console.log(`[SoccerPinGoal UserSigninConsumer] ✅ super.consume() completed`);
    }

    handleSignInSuccess(socketClient: Socket, userInfo: any, userSession: any) {
        console.log(`[SoccerPinGoal UserSigninConsumer] 🎯 handleSignInSuccess called for user: ${userInfo?.id || 'unknown'}`);
        console.log(`[SoccerPinGoal UserSigninConsumer] 🔍 socketClient.id: ${socketClient.id}`);
        // console.log(`[SoccerPinGoal UserSigninConsumer] 🔍 userSession:`, JSON.stringify(userSession, null, 2)); // 簡化日誌
        
        super.handleSignInSuccess(socketClient, userInfo, userSession);
        console.log(`[SoccerPinGoal UserSigninConsumer] ✅ super.handleSignInSuccess completed`);
        
        const boardData = this.playerResultBoardManager.getBoardData();
        this.playerResultBoardPublisher.publishBoardDataToUser(userInfo.id, boardData);
        console.log(`[SoccerPinGoal UserSigninConsumer] 📊 Board data published to user: ${userInfo.id}`);
    }

    handleSignInFailed(socketClient: Socket, reason: string) {
        console.log(`[SoccerPinGoal UserSigninConsumer] ❌ handleSignInFailed called for client: ${socketClient.id}, reason: ${reason}`);
        super.handleSignInFailed(socketClient, reason);
        console.log(`[SoccerPinGoal UserSigninConsumer] ❌ super.handleSignInFailed completed`);
    }
}
