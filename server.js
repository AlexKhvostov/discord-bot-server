import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Client, GatewayIntentBits } from 'discord.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Проверка необходимых переменных окружения
const requiredEnvVars = ['DISCORD_TOKEN', 'GUILD_ID', 'CHANNEL_ID'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Ошибка: Отсутствует переменная окружения ${envVar}`);
        process.exit(1);
    }
}

console.log('CHANNEL_ID:', process.env.CHANNEL_ID);
console.log('GUILD_ID:', process.env.GUILD_ID);

const app = express();
app.use(cors());
app.use(express.json());

// Для обслуживания статических файлов
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static('public'));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Обработка ошибок подключения к Discord
client.on('error', error => {
    console.error('Ошибка Discord клиента:', error);
});

client.on('warn', warning => {
    console.warn('Предупреждение Discord клиента:', warning);
});

// Обработка сообщений
client.on('messageCreate', async (message) => {
    try {
        // Игнорируем сообщения от ботов
        if (message.author.bot) return;
        
        // Проверяем, что сообщение в нужном канале
        if (message.channel.id !== process.env.CHANNEL_ID) return;

        // Проверяем, содержит ли сообщение приветствие
        const greetings = ['привет', 'здравствуй', 'хай', 'hello', 'hi', 'здравствуйте'];
        const messageContent = message.content.toLowerCase();
        
        if (greetings.some(greeting => messageContent.includes(greeting))) {
            await message.reply('Добро пожаловать! Рад вас видеть!');
        }
    } catch (error) {
        console.error('Ошибка при обработке сообщения:', error);
    }
});

// Middleware для проверки кодового слова
const checkCodeWord = (req, res, next) => {
    const codeWord = req.headers['x-code-word'];
    if (!codeWord || codeWord !== process.env.CODE_WORD) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Неверное кодовое слово'
        });
    }
    next();
};

// Применяем middleware ко всем API маршрутам
app.use('/api', checkCodeWord);

// Маршрут для получения списка серверов
app.get('/guilds', async (req, res) => {
    try {
        const guilds = client.guilds.cache.map(guild => ({
            id: guild.id,
            name: guild.name,
            memberCount: guild.memberCount
        }));
        res.json(guilds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Маршрут для получения списка пользователей сервера
app.get('/users', async (req, res) => {
    try {
        const guildId = req.query.guildId || process.env.GUILD_ID;
        if (!guildId) {
            return res.status(400).json({ error: 'ID сервера не указан' });
        }

        const guild = await client.guilds.fetch(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Сервер не найден' });
        }
        
        const members = await guild.members.fetch();
        const userList = members.map(member => ({
            id: member.user.id,
            username: member.user.username,
            nickname: member.nickname,
            avatar: member.user.displayAvatarURL(),
            roles: member.roles.cache.map(role => ({
                id: role.id,
                name: role.name,
                color: role.hexColor
            }))
        }));
        
        res.json(userList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Маршрут для получения информации о сервере
app.get('/guild', async (req, res) => {
    try {
        const guildId = process.env.GUILD_ID;
        if (!guildId) {
            return res.status(400).json({ error: 'ID сервера не указан в переменных окружения' });
        }

        const guild = await client.guilds.fetch(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Сервер не найден' });
        }

        res.json({
            id: guild.id,
            name: guild.name,
            icon: guild.iconURL(),
            memberCount: guild.memberCount,
            ownerId: guild.ownerId,
            createdAt: guild.createdAt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Маршрут для отправки сообщения в канал
app.post('/messages', async (req, res) => {
    try {
        const channelId = req.query.channelId || process.env.CHANNEL_ID;
        if (!channelId) {
            return res.status(400).json({ error: 'ID канала не указан' });
        }

        const { content, mentions } = req.body;

        const channel = await client.channels.fetch(channelId);
        if (!channel) {
            return res.status(404).json({ error: 'Канал не найден' });
        }

        let messageOptions = { content };

        if (mentions) {
            messageOptions.allowedMentions = {
                users: mentions.users || [],
                roles: mentions.roles || []
            };
        }

        const sentMessage = await channel.send(messageOptions);
        res.json({
            success: true,
            messageId: sentMessage.id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Маршрут для получения последних сообщений канала
app.get('/messages', async (req, res) => {
    try {
        const channelId = req.query.channelId || process.env.CHANNEL_ID;
        if (!channelId) {
            return res.status(400).json({ error: 'ID канала не указан' });
        }

        const channel = await client.channels.fetch(channelId);
        if (!channel) {
            return res.status(404).json({ error: 'Канал не найден' });
        }

        const messages = await channel.messages.fetch({ limit: 20 });
        const messageList = messages.map(msg => {
            let botResponse = null;
            
            // Проверяем наличие ссылки на сообщение
            if (msg.reference && msg.reference.messageId) {
                try {
                    // Пытаемся найти сообщение в кэше
                    const referencedMessage = messages.get(msg.reference.messageId);
                    if (referencedMessage) {
                        botResponse = referencedMessage.content;
                    } else {
                        // Если сообщение не найдено в кэше, пытаемся получить его
                        channel.messages.fetch(msg.reference.messageId)
                            .then(refMsg => {
                                botResponse = refMsg.content;
                            })
                            .catch(error => {
                                console.error('Ошибка при получении ссылочного сообщения:', error);
                                botResponse = '[Сообщение недоступно]';
                            });
                    }
                } catch (error) {
                    console.error('Ошибка при обработке ссылки на сообщение:', error);
                    botResponse = '[Ошибка при получении сообщения]';
                }
            }

            return {
                id: msg.id,
                author: {
                    id: msg.author.id,
                    username: msg.author.username,
                    avatar: msg.author.displayAvatarURL()
                },
                content: msg.content,
                timestamp: msg.createdAt,
                botResponse: botResponse,
                reference: msg.reference ? {
                    messageId: msg.reference.messageId,
                    channelId: msg.reference.channelId,
                    guildId: msg.reference.guildId
                } : null
            };
        });

        res.json(messageList);
    } catch (error) {
        console.error('Ошибка при получении сообщений:', error);
        res.status(500).json({ error: error.message });
    }
});

// Запуск сервера с обработкой ошибок
const PORT = process.env.PORT || 3000;
client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
            console.log(`URL: http://localhost:${PORT}`);
            console.log(`Бот ${client.user.tag} успешно запущен!`);
        });

        // Обработка ошибок сервера
        server.on('error', (error) => {
            console.error('Ошибка сервера:', error);
            process.exit(1);
        });
    })
    .catch(error => {
        console.error('Ошибка при запуске бота:', error);
        process.exit(1);
    }); 