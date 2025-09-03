const { MongoClient } = require('mongodb');

async function createMissingCollections() {
  const client = new MongoClient('mongodb://localhost:27017/');
  await client.connect();
  const db = client.db('minigame');
  
  console.log('🔧 Creating missing collections for SoccerPinGoal...');
  
  // 創建基於 SeDie 的集合結構
  const collections = [
    'soccerpingoal_rounds',
    'soccerpingoal_bets', 
    'soccerpingoal_results',
    'soccerpingoal_tmp_bets',
    'soccerpingoal_bet_logs'
  ];
  
  for (const collectionName of collections) {
    try {
      await db.createCollection(collectionName);
      console.log(`✅ Created collection: ${collectionName}`);
    } catch (error) {
      if (error.codeName === 'NamespaceExists') {
        console.log(`ℹ️  Collection already exists: ${collectionName}`);
      } else {
        console.log(`❌ Error creating ${collectionName}:`, error.message);
      }
    }
  }
  
  console.log('🎯 Collection creation completed!');
  await client.close();
}

createMissingCollections().catch(console.error);
