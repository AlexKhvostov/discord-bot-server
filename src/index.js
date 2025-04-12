require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});

client.once('ready', () => {
    console.log(`Бот ${client.user.tag} успешно запущен!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Команда для получения списка пользователей
    if (message.content.toLowerCase() === '!пользователи') {
        try {
            const members = await message.guild.members.fetch();
            const userList = members.map(member => 
                `${member.user.username} (${member.user.id})`
            ).join('\n');
            
            // Разбиваем сообщение на части, если оно слишком длинное
            const chunks = userList.match(/.{1,1900}/g) || [];
            for (const chunk of chunks) {
                await message.channel.send(`Список пользователей:\n\`\`\`\n${chunk}\n\`\`\``);
            }
        } catch (error) {
            console.error('Ошибка при получении списка пользователей:', error);
            message.reply('Произошла ошибка при получении списка пользователей');
        }
    }

    // Команда для отправки сообщения в канал
    if (message.content.toLowerCase().startsWith('!отправить ')) {
        const [_, channelId, ...messageParts] = message.content.split(' ');
        const text = messageParts.join(' ');
        
        try {
            const channel = await client.channels.fetch(channelId);
            if (channel) {
                await channel.send(text);
                message.reply('Сообщение успешно отправлено!');
            } else {
                message.reply('Канал не найден');
            }
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
            message.reply('Произошла ошибка при отправке сообщения');
        }
    }

    // Команда для отправки личного сообщения
    if (message.content.toLowerCase().startsWith('!личка ')) {
        const [_, userId, ...messageParts] = message.content.split(' ');
        const text = messageParts.join(' ');
        
        try {
            const user = await client.users.fetch(userId);
            if (user) {
                await user.send(text);
                message.reply('Личное сообщение успешно отправлено!');
            } else {
                message.reply('Пользователь не найден');
            }
        } catch (error) {
            console.error('Ошибка при отправке личного сообщения:', error);
            message.reply('Произошла ошибка при отправке личного сообщения');
        }
    }

    // Автоматический ответ на сообщения в канале
    if (message.content.toLowerCase().includes('бот')) {
        message.reply('Да, я здесь! Чем могу помочь?');
    }
});

client.login(process.env.DISCORD_TOKEN); 