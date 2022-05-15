const bcryptjs = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
//const axios = require("axios");

const auth = require("../middleware/auth");
// User Model
const User = require("../models/User");
const Player = require("../models/Player");

const migarateUsers = () => {
  const users = [
    {
      name: "admin",
      email: "admin@admin.com",
      password: "admin",
      active: true,
    },
    {
      name: "Ron",
      email: "Ron@admin.com",
      password: "ron",
      active: true,
    },
    {
      name: "Bob",
      email: "bob@admin.com",
      password: "bob",
      active: true,
    },
    {
      name: "Dave",
      email: "dave@admin.com",
      password: "dave",
      active: true,
    },
  ];
  users.map((user) => {
    const newUser = User.build({
      name: `${user.name}`,
      email: `${user.email}`,
      password: `${user.password}`,
      active: `${user.active}`,
    });

    // Create salt and hash

    bcryptjs.genSalt(10, (err, salt) => {
      bcryptjs.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            config.get("jwtSecret"),
            {
              expiresIn: 604800,
            },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  active: user.active,
                },
              });
            }
          );
        });
      });
    });
  });
};
const migratePlayers = () => {
  const players = [
    {
      name: "Warrior90",
      email: "war@gmail.com",
      password: "warrior90",
      active: true,
    },
    {
      name: "JohnWick",
      email: "john@yahoo.com",
      password: "JohnWick",
      active: true,
    },
    {
      name: "JeffMyName",
      email: "jeff@gmail.com",
      password: "JeffMyName",
      active: true,
    },
  ];
  players.map((player) => {
    const newplayer = Player.build({
      name: `${player.name}`,
      email: `${player.email}`,
      password: `${player.password}`,
      active: `${player.active}`,
    });

    // Create salt and hash

    bcryptjs.genSalt(10, (err, salt) => {
      bcryptjs.hash(newplayer.password, salt, (err, hash) => {
        if (err) throw err;
        newplayer.password = hash;
        newplayer.save().then((player) => {
          jwt.sign(
            { id: player.id },
            config.get("jwtSecret"),
            {
              expiresIn: 604800,
            },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                player: {
                  id: player.id,
                  name: player.name,
                  email: player.email,
                  active: player.active,
                },
              });
            }
          );
        });
      });
    });
  });
};
migarateUsers();
migratePlayers();
module.exports = { migarateUsers, migratePlayers };
