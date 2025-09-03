import { BaseSocketRouter } from "sc-game-base/src/core/routers";
import { RebetConsumer } from "../consumers";

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
            console.log(`[SoccerPinGoal SocketRouter] 📨 SIGNIN EVENT RECEIVED from client ${socketClient.id}:`, JSON.stringify(data, null, 2));
        });
        
        this.socketClient.on("rebet", this.handleRebet.bind(this));
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
}
