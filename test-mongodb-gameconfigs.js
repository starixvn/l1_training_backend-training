const { MongoClient } = require('mongodb');

async function testGameConfigs() {
    const client = new MongoClient('mongodb://localhost:27017/');
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const db = client.db('minigame');
        const collection = db.collection('game_configs');
        
        // 檢查 SoccerPinGoal (gameId: 200)
        console.log('\n🎯 Checking SoccerPinGoal (gameId: 200):');
        const soccerConfig = await collection.findOne({ gameId: 200 });
        if (soccerConfig) {
            console.log('✅ Found SoccerPinGoal config:');
            console.log(`  - enabled: ${soccerConfig.enabled}`);
            console.log(`  - name: ${soccerConfig.name}`);
            console.log(`  - delayStartTime: ${soccerConfig.delayStartTime}`);
        } else {
            console.log('❌ SoccerPinGoal config NOT FOUND!');
        }
        
        // 檢查 SeDie (gameId: 148)  
        console.log('\n🎯 Checking SeDie (gameId: 148):');
        const sedieConfig = await collection.findOne({ gameId: 148 });
        if (sedieConfig) {
            console.log('✅ Found SeDie config:');
            console.log(`  - enabled: ${sedieConfig.enabled}`);
            console.log(`  - name: ${sedieConfig.name}`);
            console.log(`  - delayStartTime: ${sedieConfig.delayStartTime}`);
        } else {
            console.log('❌ SeDie config NOT FOUND!');
        }
        
        // 統計總配置數量
        const totalConfigs = await collection.countDocuments();
        console.log(`\n📊 Total game configs in database: ${totalConfigs}`);
        
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
    } finally {
        await client.close();
    }
}

testGameConfigs();

