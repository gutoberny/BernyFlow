const API_URL = 'http://localhost:3000/api';
let token = '';

async function login() {
    try {
        const email = `test_limit_${Date.now()}@example.com`;
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email,
                password: 'password123',
                companyName: 'Test Limit Company'
            })
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        token = data.token;
        console.log('✅ Registered and logged in');
    } catch (error) {
        console.error('❌ Login failed:', error.message);
        process.exit(1);
    }
}

async function testClientLimit() {
    console.log('Testing Client Limit (Max 10)...');
    try {
        for (let i = 1; i <= 11; i++) {
            const res = await fetch(`${API_URL}/clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: `Client ${i}`,
                    email: `client${i}@example.com`
                })
            });

            if (res.ok) {
                console.log(`✅ Created Client ${i}`);
            } else {
                if (i === 11 && res.status === 403) {
                    console.log('✅ Limit correctly enforced on 11th client');
                    return;
                }
                throw new Error(`Failed to create client ${i}: ${res.status} ${await res.text()}`);
            }
        }
        console.error('❌ Limit NOT enforced! Created 11 clients.');
    } catch (error) {
        console.error('❌ Error testing limits:', error.message);
    }
}

async function run() {
    await login();
    await testClientLimit();
}

run();
