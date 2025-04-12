# Примеры использования Discord Bot API

## Получение списка пользователей

### JavaScript (Fetch API)
```javascript
async function getUsers(guildId = null) {
    try {
        const url = guildId 
            ? `http://localhost:3000/users?guildId=${guildId}`
            : 'http://localhost:3000/users';
            
        const response = await fetch(url);
        const users = await response.json();
        console.log(users);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Примеры использования:
getUsers(); // Использует ID сервера из переменных окружения
getUsers('123456789'); // Использует указанный ID сервера
```

### Python (requests)
```python
import requests

def get_users(guild_id=None):
    try:
        url = 'http://localhost:3000/users'
        if guild_id:
            url += f'?guildId={guild_id}'
            
        response = requests.get(url)
        users = response.json()
        print(users)
    except Exception as e:
        print('Ошибка:', e)

# Примеры использования:
get_users() # Использует ID сервера из переменных окружения
get_users('123456789') # Использует указанный ID сервера
```

## Отправка сообщения

### JavaScript (Fetch API)
```javascript
async function sendMessage(content, mentions = { users: [], roles: [] }, channelId = null) {
    try {
        const url = channelId 
            ? `http://localhost:3000/messages?channelId=${channelId}`
            : 'http://localhost:3000/messages';
            
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content,
                mentions
            })
        });
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Примеры использования:
sendMessage('Привет!', {
    users: ['123456789'],
    roles: ['987654321']
}); // Использует ID канала из переменных окружения

sendMessage('Привет!', {
    users: ['123456789'],
    roles: ['987654321']
}, '123456789'); // Использует указанный ID канала
```

### Python (requests)
```python
import requests
import json

def send_message(content, mentions=None, channel_id=None):
    if mentions is None:
        mentions = {'users': [], 'roles': []}
    
    try:
        url = 'http://localhost:3000/messages'
        if channel_id:
            url += f'?channelId={channel_id}'
        
        response = requests.post(
            url,
            headers={'Content-Type': 'application/json'},
            data=json.dumps({
                'content': content,
                'mentions': mentions
            })
        )
        result = response.json()
        print(result)
    except Exception as e:
        print('Ошибка:', e)

# Примеры использования:
send_message('Привет!', {
    'users': ['123456789'],
    'roles': ['987654321']
}) # Использует ID канала из переменных окружения

send_message('Привет!', {
    'users': ['123456789'],
    'roles': ['987654321']
}, '123456789') # Использует указанный ID канала
```

## Обработка ошибок

### JavaScript
```javascript
async function handleApiError(response) {
    if (!response.ok) {
        const error = await response.json();
        switch (response.status) {
            case 400:
                console.error('Неверный запрос:', error.error);
                break;
            case 401:
                console.error('Ошибка авторизации:', error.error);
                break;
            case 403:
                console.error('Доступ запрещен:', error.error);
                break;
            case 404:
                console.error('Ресурс не найден:', error.error);
                break;
            case 500:
                console.error('Внутренняя ошибка сервера:', error.error);
                break;
            default:
                console.error('Неизвестная ошибка:', error.error);
        }
    }
}
```

### Python
```python
def handle_api_error(response):
    if not response.ok:
        error = response.json()
        status = response.status_code
        
        error_messages = {
            400: 'Неверный запрос',
            401: 'Ошибка авторизации',
            403: 'Доступ запрещен',
            404: 'Ресурс не найден',
            500: 'Внутренняя ошибка сервера'
        }
        
        print(f"{error_messages.get(status, 'Неизвестная ошибка')}: {error.get('error')}")
```

## Интеграция с веб-интерфейсом

### HTML форма для отправки сообщений
```html
<form id="messageForm">
    <input type="text" id="channelId" placeholder="ID канала (опционально)">
    <textarea id="messageContent" placeholder="Введите сообщение..."></textarea>
    <div id="mentions">
        <div id="userMentions"></div>
        <div id="roleMentions"></div>
    </div>
    <button type="submit">Отправить</button>
</form>
```

### JavaScript обработка формы
```javascript
document.getElementById('messageForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const channelId = document.getElementById('channelId').value;
    const content = document.getElementById('messageContent').value;
    const mentions = {
        users: extractMentions(content, 'user'),
        roles: extractMentions(content, 'role')
    };
    
    try {
        const url = channelId 
            ? `http://localhost:3000/messages?channelId=${channelId}`
            : 'http://localhost:3000/messages';
            
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content,
                mentions
            })
        });
        
        if (!response.ok) {
            await handleApiError(response);
            return;
        }
        
        const result = await response.json();
        console.log('Сообщение отправлено:', result);
    } catch (error) {
        console.error('Ошибка:', error);
    }
});
```

## Работа с ролями пользователей

### JavaScript
```javascript
async function getUserRoles(userId, guildId = null) {
    try {
        const url = guildId 
            ? `http://localhost:3000/users?guildId=${guildId}`
            : 'http://localhost:3000/users';
            
        const response = await fetch(url);
        const users = await response.json();
        
        const user = users.find(u => u.id === userId);
        if (user) {
            return user.roles;
        }
        return [];
    } catch (error) {
        console.error('Ошибка:', error);
        return [];
    }
}
```

### Python
```python
def get_user_roles(user_id, guild_id=None):
    try:
        url = 'http://localhost:3000/users'
        if guild_id:
            url += f'?guildId={guild_id}'
            
        response = requests.get(url)
        users = response.json()
        
        user = next((u for u in users if u['id'] == user_id), None)
        if user:
            return user['roles']
        return []
    except Exception as e:
        print('Ошибка:', e)
        return []
``` 