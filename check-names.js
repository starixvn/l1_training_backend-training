const { MongoClient } = require('mongodb');

async function check() {
  const client = new MongoClient('mongodb://localhost:27017/');
  await client.connect();
  const db = client.db('minigame');
  
  console.log('🎯 SoccerPinGoal (gameId: 200):');
  const soccer = await db.collection('game_configs').findOne({ gameId: 200 });
  console.log('  name:', soccer?.name);
  console.log('  enabled:', soccer?.enabled);
  
  console.log('\n🎯 SeDie (gameId: 148):');  
  const sedie = await db.collection('game_configs').findOne({ gameId: 148 });
  console.log('  name:', sedie?.name);
  console.log('  enabled:', sedie?.enabled);
  
  console.log('\n🔍 Game Settings Comparison:');
  console.log('SoccerPinGoal game-settings.ts name: "SoccerPinGoal"');
  console.log('SeDie game-settings.ts name: "SeDieMultiplayer"');
  
  await client.close();
}

check();
