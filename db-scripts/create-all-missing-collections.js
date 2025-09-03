const { MongoClient } = require('mongodb');

async function createAllMissingCollections() {
  const client = new MongoClient('mongodb://localhost:27017/');
  await client.connect();
  const db = client.db('minigame');
  
  console.log('🔧 檢查並創建 SoccerPinGoal 所需的所有集合...');
  
  // 列出所有 SeDie 的集合作為參考
  const collections = await db.listCollections().toArray();
  const sedieCollections = collections.filter(c => c.name.startsWith('sediemultiplayer'));
  
  console.log('📊 SeDie 現有集合:');
  sedieCollections.forEach(c => console.log(`  - ${c.name}`));
  
  // 創建對應的 SoccerPinGoal 集合
  const requiredCollections = [
    'soccerpingoal_rounds',
    'soccerpingoal_tmpbets', 
    'soccerpingoal_bets',
    'soccerpingoal_results',
    'soccerpingoal_betlogs'
  ];
  
  console.log('\n🔧 創建 SoccerPinGoal 集合:');
  for (const collectionName of requiredCollections) {
    const exists = collections.some(c => c.name === collectionName);
    if (!exists) {
      await db.createCollection(collectionName);
      console.log(`  ✅ Created: ${collectionName}`);
    } else {
      console.log(`  ℹ️  Exists: ${collectionName}`);
    }
  }
  
  // 驗證並插入測試數據到 rounds 集合
  const roundsCount = await db.collection('soccerpingoal_rounds').countDocuments();
  console.log(`\n📊 soccerpingoal_rounds 文檔數量: ${roundsCount}`);
  
  if (roundsCount === 0) {
    const testRound = {
      id: 1,
      result: { red1: false, red2: true, red3: false, red4: true },
      settlementResult: { odd: false, even: true, red2: true, red3: false, red4: false, white3: false, white4: false },
      time: new Date(),
      exchangeRateId: 1
    };
    
    await db.collection('soccerpingoal_rounds').insertOne(testRound);
    console.log('✅ 插入測試文檔到 soccerpingoal_rounds');
  }
  
  await client.close();
  console.log('🎯 所有集合檢查和創建完成！');
}

createAllMissingCollections().catch(console.error);
