import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';
const CODE_WORD = '8f!nQr$9@ZcK2';

const headers = {
    'X-Code-Word': CODE_WORD
};

async function testMessages() {
    try {
        // Тест отправки сообщения с упоминанием пользователя
        console.log('1. Тест отправки сообщения с упоминанием пользователя:');
        const userMentionResponse = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: 'Тестовое сообщение с упоминанием пользователя',
                mentions: {
                    users: ['664892407476650026'],
                    roles: []
                }
            })
        });
        const userMentionResult = await userMentionResponse.json();
        console.log('Результат:', userMentionResult);

        // Тест отправки сообщения с упоминанием роли
        console.log('\n2. Тест отправки сообщения с упоминанием роли:');
        const roleMentionResponse = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: 'Тестовое сообщение с упоминанием роли',
                mentions: {
                    users: [],
                    roles: ['1311451323690127381']
                }
            })
        });
        const roleMentionResult = await roleMentionResponse.json();
        console.log('Результат:', roleMentionResult);

        // Тест отправки сообщения с упоминанием пользователя и роли
        console.log('\n3. Тест отправки сообщения с упоминанием пользователя и роли:');
        const bothMentionResponse = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: 'Тестовое сообщение с упоминанием пользователя и роли',
                mentions: {
                    users: ['664892407476650026'],
                    roles: ['1311451323690127381']
                }
            })
        });
        const bothMentionResult = await bothMentionResponse.json();
        console.log('Результат:', bothMentionResult);

    } catch (error) {
        console.error('Ошибка при тестировании:', error);
    }
}

testMessages(); 