import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import { startTrace } from "sc-instrument";

startTrace(
    (appConfigs as any).otel?.enabled,
    (appConfigs as any).otel?.endpoint,
    (appConfigs as any).otel?.system,
    appConfigs.sentry.env,
    gameSettings.name
);

import { Core, Table } from "sc-game-base";
import { generateResult, getSettlementResult } from "./helpers/result-helper";
import ContainerRegistry from "./container-registry";
import TableGameData from "./game-data";

const run = async () => {
    console.log(`[SoccerPinGoal App] 🚀 Starting SoccerPinGoal service...`);
    console.log(`[SoccerPinGoal App] ⚙️  Game settings:`, JSON.stringify(gameSettings, null, 2));
    console.log(`[SoccerPinGoal App] ⚙️  Hosting port: ${appConfigs.hostingPort}`);
    
    const definition = new Table.TableGameDefinition(gameSettings, generateResult, getSettlementResult, () => {});
    const gameData = new TableGameData(gameSettings.durations.wholeRound);
    const container = new ContainerRegistry().register(appConfigs, definition, gameData);
    console.log(`[SoccerPinGoal App] 📦 Container registered with dependencies`);
    
    const app = new Core.BaseGameApp(gameSettings.name, appConfigs);
    console.log(`[SoccerPinGoal App] 🎮 BaseGameApp created`);

    await app.run();
    console.log(`[SoccerPinGoal App] ✅ App.run() completed - Express server should be running`);
    
    await app.startGame(container);
    console.log(`[SoccerPinGoal App] 🎯 Game started with container - Socket.IO server should be ready`);
};

run();
