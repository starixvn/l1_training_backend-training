const { MongoClient } = require('mongodb');

async function quickDiagnose() {
  console.log('🔍 快速診斷...\n');
  
  const client = new MongoClient('mongodb://localhost:27017/');
  await client.connect();
  const db = client.db('minigame');
  
  try {
    console.time('關鍵查詢測試');
    const result = await db.collection('soccerpingoal_rounds')
      .findOne({}, { projection: { id: 1 }, sort: { id: -1 } });
    console.timeEnd('關鍵查詢測試');
    console.log(`✅ 查詢成功! 最大 id: ${result?.id}`);
  } catch (error) {
    console.log(`❌ 查詢失敗: ${error.message}`);
  }
  
  await client.close();
}

quickDiagnose();
