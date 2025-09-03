const io = require('socket.io-client');

// 測試會話數據
const testSession = {
    isAuthenticated: true,
    umInfo: null,
    username: "TEST_USER_COMPARISON",
    language: "vi-VN",
    fractionalOddsFormat: false,
    isUM: false,
    memberName: "test_user_comparison",
    offerGames: [{gameId: 148, minBet: 1, maxBet: 3000}, {gameId: 200, minBet: 1, maxBet: 6000}],
    rate: 1,
    ss: "test_session_token_comparison",
    system: 10
};

function testService(serviceName, url, namespace) {
    return new Promise((resolve) => {
        console.log(`\n🔍 Testing ${serviceName}...`);
        console.log(`URL: ${url}`);
        console.log(`Namespace: ${namespace}`);
        
        const socket = io(`${url}/user/${namespace}`, {
            path: '/socket.io',
            transports: ['websocket'],
            timeout: 5000
        });
        
        let connected = false;
        let signedInReceived = false;
        let messageEvents = [];
        
        const cleanup = () => {
            socket.disconnect();
            setTimeout(() => resolve({ 
                serviceName, 
                connected, 
                signedInReceived, 
                messageEvents: messageEvents.slice(0, 3) // 只記錄前3個消息
            }), 100);
        };
        
        socket.on('connect', () => {
            connected = true;
            console.log(`✅ [${serviceName}] Connected successfully`);
            
            console.log(`📤 [${serviceName}] Sending signin event...`);
            socket.emit('signin', testSession);
            
            // 5秒後結束測試
            setTimeout(cleanup, 5000);
        });
        
        socket.on('signedIn', () => {
            signedInReceived = true;
            console.log(`🎉 [${serviceName}] Received signedIn event - SUCCESS!`);
        });
        
        socket.on('message', (data) => {
            messageEvents.push(data);
            console.log(`📨 [${serviceName}] Received message:`, JSON.stringify(data, null, 2));
        });
        
        socket.on('connect_error', (error) => {
            console.log(`❌ [${serviceName}] Connection error:`, error.message);
            cleanup();
        });
        
        socket.on('disconnect', (reason) => {
            console.log(`📡 [${serviceName}] Disconnected:`, reason);
        });
    });
}

async function runTests() {
    console.log('🚀 Starting service comparison tests...\n');
    
    const results = await Promise.all([
        testService('SieDie Multiplayer', 'http://localhost:8006', 'sediemultiplayer'),
        testService('Soccer PinGoal', 'http://localhost:8010', 'soccerpingoal')
    ]);
    
    console.log('\n📊 COMPARISON RESULTS:');
    console.log('=' .repeat(50));
    
    results.forEach(result => {
        const status = result.signedInReceived ? '✅ WORKING' : '❌ BROKEN';
        console.log(`${result.serviceName}: ${status}`);
        console.log(`  - Connected: ${result.connected}`);
        console.log(`  - SignedIn event received: ${result.signedInReceived}`);
        console.log(`  - Message events count: ${result.messageEvents.length}`);
        if (result.messageEvents.length > 0) {
            console.log(`  - First message:`, JSON.stringify(result.messageEvents[0]));
        }
        console.log();
    });
    
    process.exit(0);
}

runTests().catch(console.error);




