const { MongoClient } = require('mongodb');

async function checkCollections() {
  const client = new MongoClient('mongodb://localhost:27017/');
  await client.connect();
  const db = client.db('minigame');
  
  console.log('🔍 Checking MongoDB collections:');
  const collections = await db.listCollections().toArray();
  
  const soccerRounds = collections.find(c => c.name === 'soccerpingoal_rounds');
  const sedieRounds = collections.find(c => c.name === 'sediemultiplayer_rounds');
  
  console.log('📊 SoccerPinGoal rounds:', soccerRounds ? '✅ EXISTS' : '❌ MISSING');
  console.log('📊 SeDie rounds:', sedieRounds ? '✅ EXISTS' : '❌ MISSING');
  
  if (!soccerRounds) {
    console.log('❌ soccerpingoal_rounds collection is missing!');
    console.log('🔧 This is why the cron job fails to start!');
  }
  
  console.log('\n📋 All collections containing "rounds":');
  collections
    .filter(c => c.name.includes('rounds'))
    .forEach(c => console.log(`  - ${c.name}`));
  
  await client.close();
}

checkCollections().catch(console.error);
