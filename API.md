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

### Получение информации о сервере
```
GET /guild?guildId=optional_guild_id
```

**Параметры запроса:**
- `guildId` (опционально) - ID сервера Discord. Если не указан, используется значение из переменной окружения `GUILD_ID`

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

### Получение списка пользователей сервера
```
GET /users?guildId=optional_guild_id
```

**Параметры запроса:**
- `guildId` (опционально) - ID сервера Discord. Если не указан, используется значение из переменной окружения `GUILD_ID`

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

### Отправка сообщения
```
POST /messages?channelId=optional_channel_id
```

**Параметры запроса:**
- `channelId` (опционально) - ID канала Discord. Если не указан, используется значение из переменной окружения `CHANNEL_ID`

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

### Получение сообщений канала
```
GET /messages?channelId=optional_channel_id
```

**Параметры запроса:**
- `channelId` (опционально) - ID канала Discord. Если не указан, используется значение из переменной окружения `CHANNEL_ID`

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

## Коды ошибок

- `400` - Неверный запрос (отсутствует обязательный параметр или неверный формат)
- `401` - Не авторизован (неверный токен или отсутствуют права)
- `403` - Доступ запрещен (бот не имеет доступа к серверу/каналу)
- `404` - Ресурс не найден (сервер/канал не существует)
- `500` - Внутренняя ошибка сервера

## Примеры использования

### Получение списка серверов
```javascript
fetch('http://localhost:3000/guilds')
  .then(response => response.json())
  .then(guilds => console.log(guilds));
```

### Получение информации о сервере
```javascript
// Использование ID сервера из переменных окружения
fetch('http://localhost:3000/guild')
  .then(response => response.json())
  .then(guild => console.log(guild));

// Использование указанного ID сервера
fetch('http://localhost:3000/guild?guildId=123456789')
  .then(response => response.json())
  .then(guild => console.log(guild));
```

### Получение пользователей сервера
```javascript
// Использование ID сервера из переменных окружения
fetch('http://localhost:3000/users')
  .then(response => response.json())
  .then(users => console.log(users));

// Использование указанного ID сервера
fetch('http://localhost:3000/users?guildId=123456789')
  .then(response => response.json())
  .then(users => console.log(users));
```

### Отправка сообщения
```javascript
// Использование ID канала из переменных окружения
fetch('http://localhost:3000/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Привет!',
    mentions: {
      users: ['123456789'],
      roles: ['987654321']
    }
  })
});

// Использование указанного ID канала
fetch('http://localhost:3000/messages?channelId=123456789', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Привет!',
    mentions: {
      users: ['123456789'],
      roles: ['987654321']
    }
  })
});
```

### Получение сообщений канала
```javascript
// Использование ID канала из переменных окружения
fetch('http://localhost:3000/messages')
  .then(response => response.json())
  .then(messages => console.log(messages));

// Использование указанного ID канала
fetch('http://localhost:3000/messages?channelId=123456789')
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
7. ID сервера берется из переменной окружения `GUILD_ID` в файле `.env`
8. ID канала берется из переменной окружения `CHANNEL_ID` в файле `.env`
9. Токен бота берется из переменной окружения `DISCORD_TOKEN` в файле `.env`
10. При указании параметров запроса они имеют приоритет над значениями из переменных окружения
11. Все даты возвращаются в формате ISO 8601
12. Сообщения возвращаются в порядке от новых к старым
13. По умолчанию возвращаются последние 20 сообщений 