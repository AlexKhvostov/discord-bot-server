import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';
const CODE_WORD = '8f!nQr$9@ZcK2';

const headers = {
    'X-Code-Word': CODE_WORD
};

async function testApi() {
    try {
        // Тест получения списка серверов
        console.log('1. Тест получения списка серверов:');
        const guildsResponse = await fetch(`${API_URL}/guilds`, { headers });
        const guilds = await guildsResponse.json();
        console.log('Серверы:', guilds);

        // Тест получения информации о сервере
        console.log('\n2. Тест получения информации о сервере:');
        const guildResponse = await fetch(`${API_URL}/guild`, { headers });
        const guild = await guildResponse.json();
        console.log('Информация о сервере:', guild);

        // Тест получения списка пользователей
        console.log('\n3. Тест получения списка пользователей:');
        const usersResponse = await fetch(`${API_URL}/users`, { headers });
        const users = await usersResponse.json();
        console.log('Пользователи:', users);

        // Тест отправки сообщения
        console.log('\n4. Тест отправки сообщения:');
        const messageResponse = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: 'Тестовое сообщение',
                mentions: {
                    users: [],
                    roles: []
                }
            })
        });
        const messageResult = await messageResponse.json();
        console.log('Результат отправки:', messageResult);

        // Тест получения сообщений
        console.log('\n5. Тест получения сообщений:');
        const messagesResponse = await fetch(`${API_URL}/messages`, { headers });
        const messages = await messagesResponse.json();
        console.log('Сообщения:', messages);

    } catch (error) {
        console.error('Ошибка при тестировании:', error);
    }
}

// Запуск тестов
testApi(); 