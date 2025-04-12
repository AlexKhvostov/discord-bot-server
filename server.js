require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client, GatewayIntentBits } = require('discord.js');

// Отладочный вывод
console.log('CHANNEL_ID:', process.env.CHANNEL_ID);
console.log('GUILD_ID:', process.env.GUILD_ID);

const app = express();
app.use(cors());
app.use(express.json());

// Для обслуживания статических файлов
app.use(express.static('public'));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Обработка сообщений
client.on('messageCreate', async (message) => {
    // Игнорируем сообщения от ботов
    if (message.author.bot) return;

    // Проверяем, содержит ли сообщение приветствие
    const greetings = ['привет', 'здравствуй', 'хай', 'hello', 'hi', 'здравствуйте'];
    const messageContent = message.content.toLowerCase();
    
    if (greetings.some(greeting => messageContent.includes(greeting))) {
        try {
            await message.reply('Добро пожаловать! Рад вас видеть!');
        } catch (error) {
            console.error('Ошибка при отправке ответа:', error);
        }
    }
});

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
        const messageList = messages.map(msg => ({
            id: msg.id,
            author: {
                id: msg.author.id,
                username: msg.author.username,
                avatar: msg.author.displayAvatarURL()
            },
            content: msg.content,
            timestamp: msg.createdAt,
            botResponse: msg.reference && msg.reference.messageId ? 
                messages.get(msg.reference.messageId)?.content : null
        }));

        res.json(messageList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Запуск бота
client.once('ready', () => {
    console.log(`Бот ${client.user.tag} успешно запущен!`);
});

client.login(process.env.DISCORD_TOKEN);

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
}); 