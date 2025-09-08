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

    async consume(socketClient: Socket, payload: any): Promise<void> {
        console.log(`[SeDie UserSigninConsumer] 🚀 consume() called with socketClient:`, socketClient?.id || 'unknown', 'payload keys:', Object.keys(payload || {}));
        await super.consume(socketClient, payload);
        console.log(`[SeDie UserSigninConsumer] ✅ super.consume() completed`);
    }

    handleSignInSuccess(socketClient: Socket, userInfo: any, userSession: any) {
        console.log(`[SeDie UserSigninConsumer] 🎯 handleSignInSuccess called for user: ${userInfo?.id || 'unknown'}`);
        super.handleSignInSuccess(socketClient, userInfo, userSession);
        console.log(`[SeDie UserSigninConsumer] ✅ super.handleSignInSuccess completed`);
        
        const boardData = this.playerResultBoardManager.getBoardData();
        this.playerResultBoardPublisher.publishBoardDataToUser(userInfo.id, boardData);
        console.log(`[SeDie UserSigninConsumer] 📊 Board data published to user: ${userInfo.id}`);
    }

    handleUnauthorizedSignIn(socketClient: Socket) {
        console.log(`[SeDie UserSigninConsumer] ❌ handleUnauthorizedSignIn called for client: ${socketClient.id}`);
        super.handleUnauthorizedSignIn(socketClient);
        console.log(`[SeDie UserSigninConsumer] ❌ super.handleUnauthorizedSignIn completed`);
    }
}
