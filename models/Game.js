const db = require("./../database");
const { DataTypes } = require("sequelize");

const Game = db.define(
  "Game",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
  },
  {
    // Other model options go here
    charset: "utf8",
    collate: "utf8_unicode_ci",
  }
);

module.exports = Game;
