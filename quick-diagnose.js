const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

async function quickDiagnose() {
  console.log('🔍 快速診斷 SoccerPinGoal 問題...\n');
  
  const client = new MongoClient('mongodb://localhost:27017/');
  await client.connect();
  const db = client.db('minigame');
  
  // 1. 檢查集合
  const collections = await db.listCollections().toArray();
  const soccerCollections = collections.filter(c => c.name.startsWith('soccerpingoal'));
  console.log('📊 SoccerPinGoal 集合:');
  soccerCollections.forEach(c => console.log(`  ✅ ${c.name}`));
  
  // 2. 檢查關鍵查詢
  console.log('\n🚀 測試關鍵查詢:');
  
  try {
    console.time('rounds findOne with sort');
    const result = await db.collection('soccerpingoal_rounds')
      .findOne({}, { projection: { id: 1 }, sort: { id: -1 } });
    console.timeEnd('rounds findOne with sort');
    console.log(`  ✅ 查詢成功, 最大 id: ${result?.id}`);
  } catch (error) {
    console.log(`  ❌ 查詢失敗: ${error.message}`);
  }
  
  // 3. 檢查 Mongoose 連接
  console.log('\n🔗 測試 Mongoose 連接:');
  try {
    await mongoose.connect('mongodb://localhost:27017/minigame');
    console.log('  ✅ Mongoose 連接成功');
    
    // 測試 Mongoose 查詢
    const TestModel = mongoose.model('test_soccerpingoal_rounds', new mongoose.Schema({ id: Number }), 'soccerpingoal_rounds');
    console.time('Mongoose findOne with sort');
    const mongooseResult = await TestModel.findOne({}, 'id', { sort: { id: -1 } }).lean().exec();
    console.timeEnd('Mongoose findOne with sort');
    console.log(`  ✅ Mongoose 查詢成功, 最大 id: ${mongooseResult?.id}`);
    
  } catch (error) {
    console.log(`  ❌ Mongoose 查詢失敗: ${error.message}`);
  }
  
  await client.close();
  await mongoose.disconnect();
  console.log('\n🎯 診斷完成!');
}

quickDiagnose().catch(console.error);
