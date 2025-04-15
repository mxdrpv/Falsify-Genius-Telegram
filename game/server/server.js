const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, '../miniapp')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../miniapp/views/index.html'));
});

app.get('/start_round', (req, res) => {
  res.json({ question: 'Какой ваш любимый цвет?' });  // Просто пример вопроса
});

app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
});
