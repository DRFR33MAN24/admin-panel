const Game = require("./Game");
const Player = require("./Player");
const User = require("./User");

Game.belongsToMany(Player, { through: "GamePlayers" });
Player.belongsToMany(Game, { through: "GamePlayers" });

module.exports = { Game, Player, User };
