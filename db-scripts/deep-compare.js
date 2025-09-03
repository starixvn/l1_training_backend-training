const { MongoClient } = require('mongodb');

async function deepCompare() {
  const client = new MongoClient('mongodb://localhost:27017/');
  await client.connect();
  const db = client.db('minigame');
  
  console.log('🔍 深度對比 SoccerPinGoal vs SeDie 配置：\n');
  
  const soccer = await db.collection('game_configs').findOne({ gameId: 200 });
  const sedie = await db.collection('game_configs').findOne({ gameId: 148 });
  
  console.log('📊 基本信息對比：');
  console.log('Soccer - gameId:', soccer?.gameId, 'enabled:', soccer?.enabled);
  console.log('SeDie  - gameId:', sedie?.gameId, 'enabled:', sedie?.enabled);
  
  console.log('\n📊 名稱對比：');
  console.log('Soccer - name:', `"${soccer?.name}"`);
  console.log('SeDie  - name:', `"${sedie?.name}"`);
  
  console.log('\n📊 類型和結構對比：');
  console.log('Soccer - type:', soccer?.type);
  console.log('SeDie  - type:', sedie?.type);
  
  console.log('Soccer - _id exists:', !!soccer?._id);
  console.log('SeDie  - _id exists:', !!sedie?._id);
  
  console.log('\n📊 delayStartTime 對比：');
  console.log('Soccer - delayStartTime:', soccer?.delayStartTime);
  console.log('SeDie  - delayStartTime:', sedie?.delayStartTime);
  
  // 檢查是否有其他關鍵字段差異
  const soccerKeys = Object.keys(soccer || {}).sort();
  const sedieKeys = Object.keys(sedie || {}).sort();
  
  console.log('\n📊 字段數量：');
  console.log('Soccer fields:', soccerKeys.length);
  console.log('SeDie  fields:', sedieKeys.length);
  
  const missingInSoccer = sedieKeys.filter(k => !soccerKeys.includes(k));
  const missingInSedie = soccerKeys.filter(k => !sedieKeys.includes(k));
  
  if (missingInSoccer.length > 0) {
    console.log('\n❌ Soccer 缺少的字段:', missingInSoccer);
  }
  if (missingInSedie.length > 0) {
    console.log('\n❌ SeDie 缺少的字段:', missingInSedie);
  }
  
  await client.close();
}

deepCompare();
