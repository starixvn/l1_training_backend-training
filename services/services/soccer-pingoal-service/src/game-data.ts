import { Table } from "sc-game-base";

export default class GameData extends Table.TableGameData {
    playerResultBoard: { players: any[]; totalPlayers: number; isSettled: boolean; };
    
    constructor(remainingTime: number) {
        console.log(`[SoccerPinGoal GameData] 🏗️  Constructor called with remainingTime: ${remainingTime}`);
        super(remainingTime); 
        console.log(`[SoccerPinGoal GameData] 🎮 After super() - gameConfigs:`, JSON.stringify(this.gameConfigs, null, 2));
        
        this.playerResultBoard = {
            players: [],
            totalPlayers: 0,
            isSettled: false
        };
        
        // 監控 gameConfigs 變化
        const checkConfigs = () => {
            console.log(`[SoccerPinGoal GameData] 🔍 Current gameConfigs:`, JSON.stringify(this.gameConfigs, null, 2));
        };
        
        setTimeout(checkConfigs, 1000);   // 1秒後檢查
        setTimeout(checkConfigs, 5000);   // 5秒後檢查
        setTimeout(checkConfigs, 10000);  // 10秒後檢查
    }
}          