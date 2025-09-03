const { MongoClient } = require('mongodb');

async function testCollectionQuery() {
  const client = new MongoClient('mongodb://localhost:27017/');
  await client.connect();
  const db = client.db('minigame');
  
  console.log('🧪 Testing collection queries...');
  
  try {
    console.log('📊 Testing sediemultiplayer_rounds (working):');
    const sedieResult = await db.collection('sediemultiplayer_rounds').findOne();
    console.log('✅ SeDie query successful:', sedieResult ? 'Found document' : 'Empty collection');
    
    console.log('📊 Testing soccerpingoal_rounds (problematic):');
    const soccerResult = await db.collection('soccerpingoal_rounds').findOne();
    console.log('✅ Soccer query successful:', soccerResult ? 'Found document' : 'Empty collection');
    
    // 嘗試插入一個測試文檔
    console.log('📊 Inserting test document into soccerpingoal_rounds...');
    await db.collection('soccerpingoal_rounds').insertOne({
      roundId: 1,
      gameId: 200,
      createdAt: new Date(),
      status: 'test'
    });
    console.log('✅ Test document inserted successfully');
    
    // 再次查詢
    const soccerResult2 = await db.collection('soccerpingoal_rounds').findOne();
    console.log('✅ Soccer query after insert:', soccerResult2 ? 'Found document' : 'Still empty');
    
  } catch (error) {
    console.log('❌ Query error:', error.message);
  }
  
  await client.close();
}

testCollectionQuery().catch(console.error);
