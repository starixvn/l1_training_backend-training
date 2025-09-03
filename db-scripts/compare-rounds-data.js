const { MongoClient } = require('mongodb');

async function compareRoundsData() {
  const client = new MongoClient('mongodb://localhost:27017/');
  await client.connect();
  const db = client.db('minigame');
  
  console.log('🔍 Comparing rounds collections data...');
  
  // 檢查 SeDie rounds
  console.log('\n📊 SeDie Multiplayer rounds:');
  const sedieCount = await db.collection('sediemultiplayer_rounds').countDocuments();
  console.log(`  Count: ${sedieCount}`);
  
  if (sedieCount > 0) {
    const sedieSample = await db.collection('sediemultiplayer_rounds').findOne();
    console.log('  Sample document:', JSON.stringify(sedieSample, null, 2));
  }
  
  // 檢查 SoccerPinGoal rounds  
  console.log('\n📊 SoccerPinGoal rounds:');
  const soccerCount = await db.collection('soccerpingoal_rounds').countDocuments();
  console.log(`  Count: ${soccerCount}`);
  
  if (soccerCount > 0) {
    const soccerSample = await db.collection('soccerpingoal_rounds').findOne();
    console.log('  Sample document:', JSON.stringify(soccerSample, null, 2));
  }
  
  // 如果 SoccerPinGoal 是空的，嘗試插入一個類似 SeDie 的文檔
  if (soccerCount === 0 && sedieCount > 0) {
    console.log('\n🔧 Inserting similar document to SoccerPinGoal...');
    const sedieSample = await db.collection('sediemultiplayer_rounds').findOne();
    
    const soccerDoc = {
      ...sedieSample,
      _id: undefined, // 讓 MongoDB 生成新的 _id
      id: 1, // 重置 ID
      time: new Date()
    };
    
    await db.collection('soccerpingoal_rounds').insertOne(soccerDoc);
    console.log('✅ Inserted sample document to soccerpingoal_rounds');
  }
  
  await client.close();
}

compareRoundsData().catch(console.error);
