// server/game-server.js
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Game state: { chatId: { players, phase, question, answers, votes } }
const games = {};

// Получить состояние игры
app.get('/state', (req, res) => {
  const { chatId, playerId } = req.query;
  const game = games[chatId];
  if (!game) return res.status(404).json({ error: 'Game not found' });

  res.json({
    phase: game.phase,
    question: game.question,
    isLiar: game.liarId === playerId,
    players: game.players,
    results: game.results || ''
  });
});

// Вступить в игру (на случай доп. регистрации)
app.post('/join', (req, res) => {
  const { chatId, playerId, name } = req.body;
  if (!games[chatId]) {
    games[chatId] = {
      players: {},
      phase: 'question',
      question: 'Какой у тебя был первый телефон?',
      answers: {},
      votes: {},
      liarId: null,
      results: ''
    };
  }
  games[chatId].players[playerId] = name;
  res.json({ status: 'joined' });
});

// Ответ игрока
app.post('/answer', (req, res) => {
  const { chatId, playerId, answer } = req.body;
  const game = games[chatId];
  if (!game) return res.status(404).json({ error: 'Game not found' });

  game.answers[playerId] = answer;
  res.json({ status: 'answer received' });
});

// Голосование
app.post('/vote', (req, res) => {
  const { chatId, playerId, votedId } = req.body;
  const game = games[chatId];
  if (!game) return res.status(404).json({ error: 'Game not found' });

  game.votes[playerId] = votedId;
  res.json({ status: 'vote received' });
});

// Завершить игру и рассчитать результаты
app.post('/finish', (req, res) => {
  const { chatId } = req.body;
  const game = games[chatId];
  if (!game) return res.status(404).json({ error: 'Game not found' });

  const voteCount = {};
  for (let vote of Object.values(game.votes)) {
    voteCount[vote] = (voteCount[vote] || 0) + 1;
  }

  let maxVotes = 0;
  let guessed = [];
  for (let [id, count] of Object.entries(voteCount)) {
    if (id == game.liarId) guessed.push(id);
    if (count > maxVotes) maxVotes = count;
  }

  game.results = `Лжец: ${game.players[game.liarId]}. Угадали: ${guessed.map(id => game.players[id]).join(', ') || 'никто'}!`;
  game.phase = 'results';
  res.json({ status: 'finished', results: game.results });
});

app.listen(PORT, () => console.log(`Game server running on port ${PORT}`));