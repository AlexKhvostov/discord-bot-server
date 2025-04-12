# Discord Bot API Documentation

## Базовый URL
```
http://localhost:3000
```

## Конфигурация

### Переменные окружения (.env)
```
DISCORD_TOKEN=your_bot_token
GUILD_ID=your_guild_id
CHANNEL_ID=your_channel_id
CODE_WORD=your_secret_code_word
PORT=3000
```

## Аутентификация

Все запросы к API должны содержать кодовое слово в заголовке:
```
X-Code-Word: your_secret_code_word
```

Если кодовое слово отсутствует или неверно, API вернет ошибку 401:
```json
{
  "error": "Unauthorized",
  "message": "Неверное кодовое слово"
}
```

## Эндпоинты

### Получение списка серверов
```
GET /guilds
```

**Ответ:**
```json
[
  {
    "id": "string",
    "name": "string",
    "memberCount": number
  }
]
```

### Получение списка пользователей
```
GET /users
```

**Ответ:**
```json
[
  {
    "id": "string",
    "username": "string",
    "nickname": "string | null",
    "avatar": "string",
    "roles": [
      {
        "id": "string",
        "name": "string",
        "color": "string"
      }
    ]
  }
]
```

### Получение информации о сервере
```
GET /guild
```

**Ответ:**
```json
{
  "id": "string",
  "name": "string",
  "icon": "string | null",
  "memberCount": number,
  "ownerId": "string",
  "createdAt": "string"
}
```

### Отправка сообщения
```
POST /messages
```

**Тело запроса:**
```json
{
  "content": "string",
  "mentions": {
    "users": ["string"],
    "roles": ["string"]
  }
}
```

**Ответ:**
```json
{
  "success": boolean,
  "messageId": "string"
}
```

### Получение сообщений
```
GET /messages
```

**Ответ:**
```json
[
  {
    "id": "string",
    "author": {
      "id": "string",
      "username": "string",
      "avatar": "string"
    },
    "content": "string",
    "timestamp": "string",
    "botResponse": "string | null"
  }
]
```

## Обработка ошибок

Все API эндпоинты возвращают стандартные HTTP коды состояния:
- 200: Успешный запрос
- 400: Неверные параметры запроса
- 401: Не авторизован (неверное кодовое слово)
- 404: Ресурс не найден
- 500: Внутренняя ошибка сервера

При ошибке возвращается JSON объект:
```json
{
  "error": "string",
  "message": "string"
}
```

## Примеры использования

### Получение списка серверов
```javascript
fetch('http://localhost:3000/guilds', {
  headers: {
    'X-Code-Word': 'your_secret_code_word'
  }
})
  .then(response => response.json())
  .then(guilds => console.log(guilds));
```

### Получение информации о сервере
```javascript
fetch('http://localhost:3000/guild', {
  headers: {
    'X-Code-Word': 'your_secret_code_word'
  }
})
  .then(response => response.json())
  .then(guild => console.log(guild));
```

### Получение списка пользователей
```javascript
fetch('http://localhost:3000/users', {
  headers: {
    'X-Code-Word': 'your_secret_code_word'
  }
})
  .then(response => response.json())
  .then(users => console.log(users));
```

### Отправка сообщения
```javascript
fetch('http://localhost:3000/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Code-Word': 'your_secret_code_word'
  },
  body: JSON.stringify({
    content: 'Привет!',
    mentions: {
      users: ['123456789'],
      roles: ['987654321']
    }
  })
})
  .then(response => response.json())
  .then(result => console.log(result));
```

### Получение сообщений
```javascript
fetch('http://localhost:3000/messages', {
  headers: {
    'X-Code-Word': 'your_secret_code_word'
  }
})
  .then(response => response.json())
  .then(messages => console.log(messages));
```

## Примечания

1. Все ID должны быть в формате строки
2. Аватары возвращаются в виде URL
3. Для работы API необходимо, чтобы бот был запущен и авторизован
4. Некоторые эндпоинты могут требовать определенных прав доступа бота на сервере
5. При упоминании пользователей или ролей, их ID должны быть действительными и существовать на сервере
6. Упоминания будут автоматически заменены на соответствующие теги в Discord
7. ID сервера берется из переменной окружения `GUILD_ID`
8. ID канала берется из переменной окружения `CHANNEL_ID`
9. Токен бота берется из переменной окружения `DISCORD_TOKEN`
10. Кодовое слово берется из переменной окружения `CODE_WORD`