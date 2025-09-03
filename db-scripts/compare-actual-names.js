const { MongoClient } = require('mongodb');

async function compareActualNames() {
  console.log('🔍 比較實際的集合名稱和服務配置...');
  
  // 1. 檢查資料庫中實際的集合
  const client = new MongoClient('mongodb://localhost:27017/');
  await client.connect();
  const db = client.db('minigame');
  
  const collections = await db.listCollections().toArray();
  const roundsCollections = collections.filter(c => c.name.includes('rounds'));
  
  console.log('\n📊 資料庫中實際的 rounds 集合:');
  roundsCollections.forEach(c => console.log(`  - ${c.name}`));
  
  // 2. 檢查 game-settings.ts 中的名稱
  console.log('\n⚙️  檢查 game-settings 配置...');
  
  // SeDie 的配置
  console.log('SeDie game-settings name:', 'SeDieMultiplayer');
  console.log('SeDie 預期集合名稱:', 'SeDieMultiplayer'.toLowerCase() + '_rounds');
  console.log('SeDie 實際集合是否存在:', collections.some(c => c.name === 'sediemultiplayer_rounds') ? '✅ 存在' : '❌ 不存在');
  
  // SoccerPinGoal 的配置  
  console.log('SoccerPinGoal game-settings name:', 'SoccerPinGoal');
  console.log('SoccerPinGoal 預期集合名稱:', 'SoccerPinGoal'.toLowerCase() + '_rounds');
  console.log('SoccerPinGoal 實際集合是否存在:', collections.some(c => c.name === 'soccerpingoal_rounds') ? '✅ 存在' : '❌ 不存在');
  
  // 3. 測試兩個集合的查詢速度
  console.log('\n🚀 測試查詢速度:');
  
  console.time('SeDie query');
  await db.collection('sediemultiplayer_rounds').findOne();
  console.timeEnd('SeDie query');
  
  console.time('SoccerPinGoal query');  
  await db.collection('soccerpingoal_rounds').findOne();
  console.timeEnd('SoccerPinGoal query');
  
  await client.close();
}

compareActualNames().catch(console.error);
