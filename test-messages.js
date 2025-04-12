const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000';

async function testMessages() {
    try {
        // Тест отправки сообщения с упоминаниями
        console.log('1. Тест отправки сообщения с упоминаниями:');
        const messageWithMentions = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: 'Тестовое сообщение с упоминаниями @user1 @role1',
                mentions: {
                    users: ['123456789'], // Замените на реальный ID пользователя
                    roles: ['987654321']  // Замените на реальный ID роли
                }
            })
        });
        console.log('Результат отправки с упоминаниями:', await messageWithMentions.json());

        // Тест отправки сообщения в другой канал
        console.log('\n2. Тест отправки сообщения в другой канал:');
        const messageInOtherChannel = await fetch(`${API_URL}/messages?channelId=123456789`, { // Замените на реальный ID канала
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: 'Тестовое сообщение в другой канал',
                mentions: {
                    users: [],
                    roles: []
                }
            })
        });
        console.log('Результат отправки в другой канал:', await messageInOtherChannel.json());

        // Тест получения сообщений с проверкой ссылок
        console.log('\n3. Тест получения сообщений с проверкой ссылок:');
        const messagesResponse = await fetch(`${API_URL}/messages`);
        const messages = await messagesResponse.json();
        
        // Проверяем наличие ссылок в сообщениях
        messages.forEach(msg => {
            console.log(`\nСообщение ID: ${msg.id}`);
            console.log('Содержимое:', msg.content);
            console.log('Ответ бота:', msg.botResponse);
            if (msg.reference) {
                console.log('Ссылка на сообщение:', msg.reference);
            }
        });

    } catch (error) {
        console.error('Ошибка при тестировании сообщений:', error);
    }
}

// Запуск тестов
testMessages(); 