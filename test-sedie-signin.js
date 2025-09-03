const io = require('socket.io-client');

// 測試會話數據
const testSession = {
    isAuthenticated: true,
    umInfo: null,
    username: "TEST_USER_SEDIE",
    language: "vi-VN",
    fractionalOddsFormat: false,
    isUM: false,
    memberName: "test_user_sedie",
    offerGames: [{gameId: 148, minBet: 1, maxBet: 3000}],
    rate: 1,
    ss: "test_session_token_sedie",
    system: 10
};

console.log('🧪 Testing SeDie Multiplayer signin behavior...');

const socket = io('http://localhost:8006/user/sediemultiplayer', {
    path: '/socket.io',
    transports: ['websocket'],
    timeout: 5000
});

let connected = false;
let signedIn = false;

socket.on('connect', () => {
    connected = true;
    console.log(`✅ SeDie Connected successfully`);
    
    console.log(`📤 SeDie Sending signin event...`);
    socket.emit('signin', testSession);
    
    setTimeout(() => {
        if (!signedIn) {
            console.log(`❌ SeDie No signedIn response received within 5 seconds`);
        }
        socket.disconnect();
    }, 5000);
});

socket.on('signedIn', () => {
    signedIn = true;
    console.log(`🎉 SeDie RECEIVED signedIn event - SUCCESS!`);
});

socket.on('connect_error', (error) => {
    console.log(`❌ SeDie Connection error:`, error.message);
});

socket.on('disconnect', (reason) => {
    console.log(`📡 SeDie Disconnected:`, reason);
    if (connected && signedIn) {
        console.log(`✅ SeDie signin flow WORKS correctly`);
    } else if (connected && !signedIn) {
        console.log(`❌ SeDie signin flow BROKEN - connected but no signedIn response`);
    }
    process.exit(signedIn ? 0 : 1);
});

// 監聽所有事件
socket.onAny((eventName, ...args) => {
    console.log(`📨 SeDie received event: ${eventName}`, args);
});

// 超時
setTimeout(() => {
    console.log('\n⏰ Test timeout');
    process.exit(1);
}, 8000);
