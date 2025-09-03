export default {
    hostingPort: 8010,
    apiSettings: {
        enabledApi: true,
        apiUrl: "http://localhost:8002",
        authUrl: "http://localhost:8001",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },
        useAuthenticate: true,
        requestTimeout: 10000,
        placeBetTimeout: 2000,
        enabledApiLogs: true,
    },
    authenticateSettings: {
        url: "http://localhost:8001",
        id: "game-services",
        secret: "gameservices@20luminet&",
        requestTimeout: 10000,
        useAuthenticate: true,
        audiences: ["api", "admin-api"],
    },
    userServiceSettings: {
        url: "http://localhost:8004",
    },
    socketOptions: {
        pingInterval: 60 * 1000,
        pingTimeout: 60 * 1000,
        transports: ["websocket"],
        allowUpgrades: false,
        perMessageDeflate: false,
    },
    enabledLogs: true,
    database: {
        url: "mongodb://localhost:27017/",
        options: {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    sentry: {
        sentryUrl: "",
        logIdentifier: "soccer-pingoal",
        env: "DEV",
    },
    adminSecretKey: "asWDEerfOIdgsdqRTFabvmgh",
    disableCors: true,
    gameManagementApiSettings: {
        BASE: "http://localhost:8005",
    },
};
