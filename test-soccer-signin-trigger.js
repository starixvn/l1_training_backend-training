const io = require('socket.io-client');

console.log('🧪 Testing SoccerPinGoal signin to trigger API logs...');

const socket = io('http://localhost:8010/user/soccerpingoal', {
  transports: ['websocket'],
  forceNew: true
});

socket.on('connect', () => {
  console.log('✅ Socket connected, sending signin...');
  
  // 模擬 signin 事件
  socket.emit('signin', {
    isAuthenticated: true,
    username: 'test_user_123',
    language: 'en-US',
    ss: 'test_session_token',
    system: 10,
    memberName: 'test_member',
    rate: 1,
    offerGames: [{gameId: 200, minBet: 1, maxBet: 2000}],
    fractionalOddsFormat: false,
    isUM: false
  });
});

socket.on('message', (data) => {
  console.log('📨 Received message:', data);
});

socket.on('signedIn', () => {
  console.log('🎉 SignedIn event received!');
  process.exit(0);
});

socket.on('disconnect', () => {
  console.log('🔌 Socket disconnected');
});

socket.on('error', (error) => {
  console.log('❌ Socket error:', error);
});

// 10秒後自動退出
setTimeout(() => {
  console.log('⏰ Test timeout, checking logs...');
  process.exit(0);
}, 10000);
