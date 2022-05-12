const bcryptjs = require("bcryptjs");
//const config = require("config");
const jwt = require("jsonwebtoken");
//const axios = require("axios");

const auth = require("../middleware/auth");
// User Model
const User = require("../models/User");

const migarateUsers = () => {
  const adminUser = {
    name: "admin",
    email: "admin@admin.com",
    password: "admin",
    active: true,
  };

  const newUser = User.build({
    name: `${adminUser.name}`,
    email: `${adminUser.email}`,
    password: `${adminUser.password}`,
    active: `${adminUser.active}`,
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
};
migarateUsers();
module.exports = migarateUsers;
