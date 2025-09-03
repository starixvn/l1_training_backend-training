const io = require('socket.io-client');

// 測試會話數據
const testSession = {
    isAuthenticated: true,
    umInfo: null,
    username: "TEST_USER",
    language: "vi-VN",
    fractionalOddsFormat: false,
    isUM: false,
    memberName: "test_user_123",
    offerGames: [{gameId: 148, minBet: 1, maxBet: 3000}, {gameId: 200, minBet: 1, maxBet: 6000}],
    rate: 1,
    ss: "test_session_token",
    system: 10
};

function testService(serviceName, url, namespace) {
    console.log(`\n🔍 Testing ${serviceName}...`);
    console.log(`URL: ${url}`);
    console.log(`Namespace: ${namespace}`);
    
    const socket = io(`${url}/user/${namespace}`, {
        path: '/socket.io',
        transports: ['websocket'],
        timeout: 5000
    });
    
    let connected = false;
    let signedIn = false;
    
    socket.on('connect', () => {
        connected = true;
        console.log(`✅ [${serviceName}] Connected successfully`);
        
        // 發送 signin 事件
        console.log(`📤 [${serviceName}] Sending signin event...`);
        socket.emit('signin', testSession);
        
        // 設置超時檢查
        setTimeout(() => {
            if (!signedIn) {
                console.log(`❌ [${serviceName}] No signedIn response received within 5 seconds`);
            }
            socket.disconnect();
        }, 5000);
    });
    
    socket.on('signedIn', () => {
        signedIn = true;
        console.log(`✅ [${serviceName}] Received signedIn event - SUCCESS!`);
    });
    
    socket.on('connect_error', (error) => {
        console.log(`❌ [${serviceName}] Connection error:`, error.message);
    });
    
    socket.on('disconnect', (reason) => {
        console.log(`📡 [${serviceName}] Disconnected:`, reason);
        if (connected && signedIn) {
            console.log(`🎉 [${serviceName}] Test PASSED - signin flow worked correctly`);
        } else if (connected && !signedIn) {
            console.log(`❌ [${serviceName}] Test FAILED - connected but no signedIn response`);
        } else {
            console.log(`❌ [${serviceName}] Test FAILED - connection failed`);
        }
    });
    
    // 監聽所有事件以進行調試
    socket.onAny((eventName, ...args) => {
        if (eventName !== 'connect' && eventName !== 'signedIn' && eventName !== 'disconnect') {
            console.log(`📨 [${serviceName}] Event: ${eventName}`, args);
        }
    });
}

console.log('🚀 Starting Socket.IO signin tests...');

// 測試 SeDie Multiplayer (應該工作正常)
testService('SeDie Multiplayer', 'http://localhost:8006', 'sediemultiplayer');

// 等待一下然後測試 SoccerPinGoal
setTimeout(() => {
    testService('Soccer PinGoal', 'http://localhost:8010', 'soccerpingoal');
}, 2000);

// 10秒後結束測試
setTimeout(() => {
    console.log('\n🏁 Test completed');
    process.exit(0);
}, 12000);
