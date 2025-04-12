# Discord Bot API

Простой API для взаимодействия с Discord ботом, предоставляющий функционал для работы с пользователями сервера и отправки сообщений.

## Функциональность

- Получение списка пользователей сервера
- Отправка сообщений в канал с поддержкой упоминаний пользователей и ролей

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/discord-api.git
cd discord-api
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` и добавьте необходимые переменные окружения:
```
DISCORD_TOKEN=your_bot_token
GUILD_ID=your_guild_id
CHANNEL_ID=your_channel_id
```

## Запуск

Для запуска в режиме разработки:
```bash
npm run dev
```

Для запуска в продакшн режиме:
```bash
npm start
```

## API Документация

Подробная документация по API доступна в файле [API.md](API.md).

## Технологии

- Node.js
- Express.js
- Discord.js
- HTML/CSS/JavaScript

## Лицензия

MIT 