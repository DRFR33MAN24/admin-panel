const bcryptjs = require("bcryptjs");
//const config = require("config");
const jwt = require("jsonwebtoken");
//const axios = require("axios");

const auth = require("../middleware/auth");
// User Model
const User = require("../models/User");

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
migarateUsers();
module.exports = migarateUsers;
