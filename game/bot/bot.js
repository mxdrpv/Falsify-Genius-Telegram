// /bot/bot.js
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { Game, Player } = require('../game/models/gameModel');
const { startGame, handleVote } = require('../game/miniapp/js/game');

// Настройка бота
const bot = new TelegramBot('YOUR_BOT_TOKEN', { polling: true });

// Слушаем команду /start_game в чате
bot.onText(/\/start_game/, (msg) => {
  const chatId = msg.chat.id;

  // Набор игроков из участников чата
  const players = msg.chat.members.map(member => ({
    id: member.user.id,
    username: member.user.username
  }));

  if (players.length < 3) {
    bot.sendMessage(chatId, 'Для начала игры требуется минимум 3 игрока.');
    return;
  }

  // Отправляем инлайн-кнопку "Начать игру"
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Начать игру", callback_data: 'start_game' }]
      ]
    }
  };

  bot.sendMessage(chatId, 'Нажмите "Начать игру", чтобы начать!', options);
});

// Обработка нажатия на инлайн-кнопку "Начать игру"
bot.on('callback_query', (query) => {
  if (query.data === 'start_game') {
    const chatId = query.message.chat.id;

    // Запускаем игру на миниаппе
    axios.post('https://your-server-url/start_game', {
      players: query.message.chat.members,  // передаем игроков
    }).then(response => {
      bot.sendMessage(chatId, 'Игра началась! Перейдите в миниапп для продолжения.');
    }).catch(error => {
      console.error(error);
      bot.sendMessage(chatId, 'Ошибка при запуске игры.');
    });
  }
});

// Обработка голосования
bot.onText(/\/vote (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const votedId = match[1];  // ID игрока, за которого проголосовали

  handleVote(msg.from.id, votedId); // Обработка голосования в игре
  bot.sendMessage(chatId, `Вы проголосовали за игрока ${votedId}`);
});
