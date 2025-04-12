// webapp/script.js
const urlParams = new URLSearchParams(window.location.search);
const chatId = urlParams.get('chatId');
const playerId = urlParams.get('playerId');
const apiBase = 'https://kaidomaks-001-site1.qtempurl.com';

const status = document.getElementById('status');
const questionDiv = document.getElementById('question');
const inputPhase = document.getElementById('inputPhase');
const votePhase = document.getElementById('votePhase');
const resultPhase = document.getElementById('resultPhase');

async function fetchGameState() {
  const res = await fetch(`${apiBase}/state?chatId=${chatId}&playerId=${playerId}`);
  if (!res.ok) return console.error('Ошибка получения состояния игры');
  return res.json();
}

async function joinGame() {
  await fetch(`${apiBase}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, playerId, name: 'Игрок ' + playerId })
  });
}

function renderGame(gameState) {
  status.style.display = 'none';
  questionDiv.style.display = 'none';
  inputPhase.style.display = 'none';
  votePhase.style.display = 'none';
  resultPhase.style.display = 'none';

  switch (gameState.phase) {
    case 'question':
      questionDiv.style.display = 'block';
      document.getElementById('questionText').textContent = gameState.question;
      break;

    case 'answer':
      inputPhase.style.display = 'block';
      document.getElementById('submitAnswer').onclick = async () => {
        const answer = document.getElementById('answerInput').value;
        await fetch(`${apiBase}/answer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId, playerId, answer })
        });
        status.textContent = 'Ожидаем других игроков...';
        status.style.display = 'block';
        inputPhase.style.display = 'none';
      };
      break;

    case 'vote':
      votePhase.style.display = 'block';
      const playersList = document.getElementById('playersList');
      playersList.innerHTML = '';
      for (let id in gameState.players) {
        if (id !== playerId) {
          const btn = document.createElement('button');
          btn.textContent = gameState.players[id];
          btn.onclick = async () => {
            await fetch(`${apiBase}/vote`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chatId, playerId, votedId: id })
            });
            status.textContent = 'Голос принят. Ждём других...';
            status.style.display = 'block';
            votePhase.style.display = 'none';
          };
          playersList.appendChild(btn);
        }
      }
      break;

    case 'results':
      resultPhase.style.display = 'block';
      document.getElementById('results').textContent = gameState.results;
      break;
  }
}

async function loop() {
  try {
    const state = await fetchGameState();
    if (state) renderGame(state);
  } catch (e) {
    console.error('Ошибка обновления:', e);
  } finally {
    setTimeout(loop, 2000); // опрашиваем каждые 2 секунды
  }
}

(async () => {
  await joinGame();
  await loop();
})();
