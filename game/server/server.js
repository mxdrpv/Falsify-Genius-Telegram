const express = require('express');
const app = express();
const path = require('path');
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import startBot from '../bot/bot.js';

const app = express();
const port = process.env.PORT || 10000;
const MINIAPP_URL = process.env.MINIAPP_URL || `${process.env.RENDER_EXTERNAL_URL}/game`;

dotenv.config();

app.use('/game', express.static(path.join(__dirname, 'miniapp')));

app.get('/api/game', (req, res) => {
  res.json({ status: 'game server running', miniappUrl: process.env.MINIAPP_URL });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../miniapp/views/index.html'));
});

app.get('/start_round', (req, res) => {
  res.json({ question: 'Какой ваш любимый цвет?' });  // Просто пример вопроса
});

startBot();

app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
});
