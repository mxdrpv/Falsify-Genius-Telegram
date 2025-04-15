function pickLiar(players) {
  const liarIndex = Math.floor(Math.random() * players.length);
  return players[liarIndex].id;
}

function isLiar(playerId, liarId) {
  return playerId === liarId;
}

function calculateScores(players, liarId, votedIds) {
  players.forEach(player => {
    if (votedIds.includes(player.id) && player.id !== liarId) {
      player.incrementScore(1);
    }
    if (player.id === liarId && !votedIds.includes(player.id)) {
      player.incrementScore(4);
    }
    if (votedIds.includes(player.id) && player.id === liarId) {
      player.incrementScore(-1);
    }
  });
}

module.exports = { pickLiar, isLiar, calculateScores };
