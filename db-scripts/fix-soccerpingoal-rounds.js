const { MongoClient } = require('mongodb');

async function fixSoccerPinGoalRounds() {
  const client = new MongoClient('mongodb://localhost:27017/');
  await client.connect();
  const db = client.db('minigame');
  
  console.log('🔧 Fixing SoccerPinGoal rounds collection structure...');
  
  // 清空錯誤的文檔
  await db.collection('soccerpingoal_rounds').deleteMany({});
  console.log('✅ Cleared existing incorrect documents');
  
  // 插入正確結構的文檔（基於 SeDie 模型）
  const correctDoc = {
    id: 1,
    result: {
      red1: false,
      red2: true,
      red3: false,
      red4: true
    },
    settlementResult: {
      odd: false,
      even: true,
      red2: true,
      red3: false,
      red4: false,
      white3: false,
      white4: false
    },
    time: new Date(),
    exchangeRateId: 1
  };
  
  await db.collection('soccerpingoal_rounds').insertOne(correctDoc);
  console.log('✅ Inserted correct document structure');
  
  // 驗證插入
  const inserted = await db.collection('soccerpingoal_rounds').findOne();
  console.log('📊 Verification - inserted document:');
  console.log(JSON.stringify(inserted, null, 2));
  
  await client.close();
  console.log('🎯 SoccerPinGoal rounds collection fixed!');
}

fixSoccerPinGoalRounds().catch(console.error);
