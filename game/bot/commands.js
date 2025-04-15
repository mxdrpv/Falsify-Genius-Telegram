const { bot } = require('./bot');
const { Game, Player } = require('../models/gameModel');

let currentGame = null;

// Обработчик команды /game
bot.onText(/\/game/, (msg) => {
  const chatId = msg.chat.id;
  const playerId = msg.from.id;
  const playerName = msg.from.username;

  // Проверяем, что команда пришла из группового чата
  if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
    bot.sendMessage(chatId, 'Команда /game работает только в групповых чатах!');
    return;
  }

  // Если игра уже началась
  if (currentGame) {
    bot.sendMessage(chatId, 'Игра уже началась!');
    return;
  }

  // Создаем новый объект игры
  currentGame = new Game();
  currentGame.addPlayer(new Player(playerId, playerName));

  bot.sendMessage(chatId, `${playerName} присоединился в игру! Набираем игроков...`);

  // Если игроков достаточно, отправляем инлайн кнопку
  if (currentGame.getAllPlayers().length >= 3) {
    const options = {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Начать игру', callback_data: 'start_game' }],
        ],
      },
    };
    bot.sendMessage(chatId, 'Достаточно игроков! Нажмите "Начать игру", чтобы продолжить', options);
  }
});

// Обработчик нажатия кнопки "Начать игру"
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  if (query.data === 'start_game') {
    bot.sendMessage(chatId, 'Игра начнётся в миниаппе!');
    // Перенаправление игроков в миниапп
    startGame(currentGame.getAllPlayers());
    currentGame = null;  // Сбрасываем текущую игру
  }
});
