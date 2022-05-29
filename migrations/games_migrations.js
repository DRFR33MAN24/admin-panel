const { Game, Player, User } = require("../models");
const migrateGames = () => {
  console.log(Game);
  const games = [
    { name: "Happy Farm", gameImage: "noImg" },
    { name: "Dead Zone", gameImage: "noImg" },
  ];

  games.map(async (g) => {
    const newGame = await Game.create(g);
    newGame.addPlayer(await Player.findByPk(1));
  });
};

module.exports = { migrateGames };

migrateGames();
