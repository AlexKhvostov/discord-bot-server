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

### Получение списка пользователей сервера
```
GET /users
```

**Примечание:** ID сервера берется из переменной окружения `GUILD_ID`

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
POST /messages
```

**Примечание:** ID канала берется из переменной окружения `CHANNEL_ID`

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

**Пример запроса:**
```json
{
  "content": "Привет, @user1 и @user2!",
  "mentions": {
    "users": ["123456789", "987654321"],
    "roles": ["456789123"]
  }
}
```

## Коды ошибок

- `400` - Неверный запрос
- `401` - Не авторизован
- `403` - Доступ запрещен
- `404` - Ресурс не найден
- `500` - Внутренняя ошибка сервера

## Примеры использования

### Получение пользователей сервера
```javascript
fetch('http://localhost:3000/users')
  .then(response => response.json())
  .then(users => console.log(users));
```

### Отправка сообщения
```javascript
fetch('http://localhost:3000/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Привет, @user1 и @user2!',
    mentions: {
      users: ['123456789', '987654321'],
      roles: ['456789123']
    }
  })
})
.then(response => response.json())
.then(result => console.log(result));
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