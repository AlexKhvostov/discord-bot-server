import fetch from 'node-fetch';

const API_URL = 'https://discord-bot-server-o6g1.onrender.com';

async function testEndpoint(name, url, options = {}) {
    try {
        console.log(`\nТестирование ${name}:`);
        const response = await fetch(url, options);
        console.log(`Статус: ${response.status}`);
        if (response.ok) {
            const data = await response.json();
            console.log('Результат:', JSON.stringify(data, null, 2));
            return data;
        } else {
            console.log('Ошибка:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error.message);
        return null;
    }
}

async function testRenderApi() {
    console.log('Тестирование API на Render...\n');

    // 1. Проверка списка серверов
    await testEndpoint('GET /guilds', `${API_URL}/guilds`);

    // 2. Проверка информации о сервере
    await testEndpoint('GET /guild', `${API_URL}/guild`);

    // 3. Проверка списка пользователей
    await testEndpoint('GET /users', `${API_URL}/users`);

    // 4. Отправка тестового сообщения
    await testEndpoint('POST /messages', `${API_URL}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: 'Тестовое сообщение с Render',
            mentions: {
                users: [],
                roles: []
            }
        })
    });

    // 5. Получение сообщений
    await testEndpoint('GET /messages', `${API_URL}/messages`);
}

// Запуск тестов
testRenderApi(); 