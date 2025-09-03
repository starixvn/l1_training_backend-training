import { io } from "socket.io-client";
import MsgpackParser from "socket.io-msgpack-parser";
import { getAppSettings } from "../app-settings";
import { buildServerUrl } from "../helpers";
import { SocketInfo } from "./../../components/game-base/type";
import { GameMessageHandler, messageEventType } from "../../components/game-base/handlers";
import useGameStore from "../stores/game-store/game-store";
import useBettingStore from "../stores/betting-store/betting-store";

export function InitSocketIO(socketInfo: SocketInfo, session: any, gameName: string, gameMessageHandler: GameMessageHandler) {
    const { proxy, enableMsgpackParser, socketGatewayPath } = getAppSettings();

    // Use direct service endpoint if available, otherwise use the original proxy approach
    let socketUri: string;
    let socketPath: string;

    if (socketInfo.serviceEndpoint) {
        // Direct connection to service endpoint with correct namespace
        const namespace = `/user/${socketInfo.namespace}`;
        socketUri = `${socketInfo.serviceEndpoint}${namespace}`;
        socketPath = "/socket.io";
        console.log(`[SOCKET] Direct connection to service: ${socketUri} with path: ${socketPath}`);
    } else {
        // Original proxy approach through game client
        socketUri = buildServerUrl(socketInfo.namespace);
        socketPath = !proxy.path && socketGatewayPath ? `/${socketGatewayPath}/socket.io` : `${proxy.path}/${socketInfo.path}/socket.io`;
        console.log(`[SOCKET] Proxy connection through game client: ${socketUri}${socketPath}`);
    }

    const socketOption = {
        forceNew: true,
        transports: ["websocket"],
        path: socketPath,
        upgrade: false,
        parser: enableMsgpackParser ? MsgpackParser : undefined,
    };

    const socket = io(socketUri, socketOption);

    if (socket) {
        gameMessageHandler.registerSocketEvents();
        useGameStore.getState().setSocket(socket);

        socket.off(gameName).on(gameName, (message) => {
            gameMessageHandler.broadcastGameEvent(message);
            useGameStore.getState().registerEvent(message);
            useBettingStore.getState().registerEvent(message);
        });
        socket.off("message").on("message", (message) => {
            gameMessageHandler.broadcastGameMessage(message);
            useGameStore.getState().registerEvent(message);
        });

        socket.on(messageEventType.SOCKET_CONNECTED, () => {
            console.log(`[SOCKET] Connected to ${gameName}, emitting signin with session:`, session);
            socket.emit("signin", session);
            
            // Debug: Set timeout to check if signin response is received
            setTimeout(() => {
                console.log(`[SOCKET] DEBUG: 3 seconds after signin, current connected status:`, socket.connected);
            }, 3000);
            
            gameMessageHandler.broadcastGameEvent({ [messageEventType.SOCKET_CONNECTED]: true });
        });

        socket.on(messageEventType.SIGNED_IN, () => {
            console.log(`[SOCKET] ✅ Received signedIn event for ${gameName}, emitting inGame`);
            socket.emit("inGame", gameName);
            gameMessageHandler.broadcastGameEvent({ [messageEventType.SIGNED_IN]: true });
        });

        // Debug: Listen to all events to see what's actually being received
        socket.onAny((eventName, ...args) => {
            console.log(`[SOCKET] 📨 ${gameName} received event: ${eventName}`, args);
            
            // Check if message event contains signin information
            if (eventName === 'message' && args.length > 0) {
                const messageData = args[0];
                console.log(`[SOCKET] 🔍 Message event data:`, JSON.stringify(messageData, null, 2));
                
                // Check if this message indicates successful signin
                if (messageData && (messageData.signedIn || messageData.isAuthenticated || messageData.signin)) {
                    console.log(`[SOCKET] 🚨 Message contains signin data! Should trigger signedIn event.`);
                }
            }
        });

        socket.on(messageEventType.SOCKET_CONNECT_ERROR, () => {
            gameMessageHandler.broadcastGameEvent({ [messageEventType.SOCKET_CONNECT_ERROR]: true });
        });
        socket.on(messageEventType.SOCKET_DISCONNECTED, () => {
            gameMessageHandler.broadcastGameEvent({ [messageEventType.SOCKET_DISCONNECTED]: true });
        });
    }

    return { socket };
}

export enum SocketState {
    None,
    Connected,
    Error,
    Disconnected,
}
