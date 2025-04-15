import dotenv from 'dotenv';
dotenv.config();
const express = require('express');
const path = require('path');
const { Telegraf } = require('telegraf');

// Инициализация
const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

// Маршрут для фронтенда (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// Команды бота
bot.command('start', (ctx) => {
  ctx.reply('🚀 Добро пожаловать в Falsify Genius!');
});

// Включение вебхука (обязательно для Render)
app.use(bot.webhookCallback('/webhook'));
bot.telegram.setWebhook(`${process.env.RENDER_EXTERNAL_URL}/webhook`);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
