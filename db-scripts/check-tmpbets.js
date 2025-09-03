const { MongoClient } = require('mongodb');

async function checkTempBets() {
  const client = new MongoClient('mongodb://localhost:27017/');
  await client.connect();
  const db = client.db('minigame');
  
  console.log('🔍 檢查 tmpbets 集合:');
  
  const sedieExists = await db.listCollections({name: 'sediemultiplayer_tmpbets'}).hasNext();  
  const soccerExists = await db.listCollections({name: 'soccerpingoal_tmpbets'}).hasNext();
  
  console.log('SeDie tmpbets 存在:', sedieExists ? '✅ YES' : '❌ NO');
  console.log('Soccer tmpbets 存在:', soccerExists ? '✅ YES' : '❌ NO');
  
  if (!soccerExists) {
    console.log('🔧 Creating missing soccerpingoal_tmpbets...');
    await db.createCollection('soccerpingoal_tmpbets');
    console.log('✅ Created soccerpingoal_tmpbets');
  }
  
  await client.close();
}

checkTempBets().catch(console.error);
