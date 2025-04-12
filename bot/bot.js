// bot/bot.js
const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

// Токен бота
const token = '8029378430:AAEjjdnETPAHh8rRC2EFaB9AmXDNCEf2Bv8';
const bot = new TelegramBot(token, { polling: true });

// API для игры
const apiBase = 'https://kaidomaks-001-site1.qtempurl.com';

// Хранение активных игр
const activeGames = {};

// Команда /start_game — создание игры
bot.onText(/\/start_game/, async (msg) => {
  const chatId = msg.chat.id;
  if (!activeGames[chatId]) {
    activeGames[chatId] = { players: [] };
    bot.sendMessage(chatId, 'Игра начинается! Ждём игроков...', {
      reply_markup: {
        inline_keyboard: [[{ text: 'Вступить в игру', callback_data: 'join' }]]
      }
    });
  } else {
    bot.sendMessage(chatId, 'Игра уже началась!');
  }
});

// Обработчик кнопки «Вступить»
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const playerId = query.from.id;
  const playerName = query.from.first_name;

  if (query.data === 'join') {
    // Регистрируем игрока
    if (!activeGames[chatId].players.includes(playerId)) {
      activeGames[chatId].players.push(playerId);
      await fetch(`${apiBase}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, playerId, name: playerName })
      });

      // Отправляем ссылку на MiniApp
      const miniAppLink = `https://t.me/your_bot?start=chatId=${chatId}&playerId=${playerId}`;
      bot.sendMessage(chatId, `Игрок ${playerName} присоединился! Перейдите по ссылке для начала игры: ${miniAppLink}`);
    } else {
      bot.sendMessage(chatId, 'Вы уже в игре!');
    }
  }
});

// Завершение игры
bot.onText(/\/finish_game/, async (msg) => {
  const chatId = msg.chat.id;
  if (activeGames[chatId]) {
    // Завершаем игру
    await fetch(`${apiBase}/finish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId })
    });
    bot.sendMessage(chatId, 'Игра завершена. Результаты:');
  } else
