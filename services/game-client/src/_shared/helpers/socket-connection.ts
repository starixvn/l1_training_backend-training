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
            socket.emit("signin", session);
            gameMessageHandler.broadcastGameEvent({ [messageEventType.SOCKET_CONNECTED]: true });
        });

        socket.on(messageEventType.SIGNED_IN, () => {
            socket.emit("inGame", gameName);
            gameMessageHandler.broadcastGameEvent({ [messageEventType.SIGNED_IN]: true });
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
