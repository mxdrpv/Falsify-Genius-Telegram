// /miniapp/js/game.js
document.getElementById('start-game').addEventListener('click', () => {
  // Тут будет логика начала игры
  console.log("Игра началась!");
});
// Функция для старта игры
function startGame(players) {
  // Отправляем запрос на сервер, чтобы начать игру
  fetch('/start_game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ players: players })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Игра началась!');
      // Отправить информацию игрокам, что игра началась
      startRound();
    } else {
      console.error('Ошибка при запуске игры:', data.message);
    }
  })
  .catch(error => console.error('Ошибка при старте игры:', error));
}

// Функция для начала раунда
function startRound() {
  console.log('Раунд начался!');

  // Отправляем запрос на сервер для начала раунда
  fetch('/start_round')
    .then(response => response.json())
    .then(data => {
      if (data.question) {
        document.getElementById('game').innerHTML = `Раунд начался! Вопрос: ${data.question}`;
        // Показать вопросы игрокам, если они должны их ответить
      } else {
        console.error('Ошибка при получении вопроса:', data);
      }
    })
    .catch(error => console.error('Ошибка при старте раунда:', error));

  // Симулируем, что игроки отправили свои ответы и проголосовали
  setTimeout(() => {
    handleVote(1, 2); // Пример, что игрок 1 голосует за игрока 2
    finishRound();
  }, 60000); // Таймер на 60 секунд (пишем для примера)
}

// Завершаем раунд и начисляем очки
function finishRound() {
  console.log('Раунд завершён! Подсчёт очков...');

  // Подсчитываем очки после голосования
  fetch('/finish_round', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ liarId: 2, votedIds: [1] }) // Пример, кто был лжецом и за кого проголосовали
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Очки после раунда:');
      data.players.forEach(player => {
        console.log(`${player.username}: ${player.score} очков`);
      });
    } else {
      console.error('Ошибка при подсчёте очков:', data.message);
    }
  })
  .catch(error => console.error('Ошибка при подсчёте очков:', error));
}

// Обработка голосования
function handleVote(voterId, votedId) {
  console.log(`Игрок ${voterId} проголосовал за игрока ${votedId}`);

  // Отправляем запрос на сервер для обработки голосования
  fetch('/handle_vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voterId: voterId, votedId: votedId })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Голос учтён!');
    } else {
      console.error('Ошибка при голосовании:', data.message);
    }
  })
  .catch(error => console.error('Ошибка при голосовании:', error));
}

// Экспортируем функции, если нужно для тестирования
module.exports = { startGame, handleVote, finishRound };
