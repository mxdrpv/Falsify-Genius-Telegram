class Player {
  constructor(id, username) {
    this.id = id;
    this.username = username;
    this.score = 0;
  }

  incrementScore(amount) {
    this.score += amount;
  }
}

class Game {
  constructor() {
    this.players = [];
    this.liarId = null;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getAllPlayers() {
    return this.players;
  }

  setLiar(id) {
    this.liarId = id;
  }

  getPlayerById(id) {
    return this.players.find(player => player.id === id);
  }
}

module.exports = { Game, Player };
