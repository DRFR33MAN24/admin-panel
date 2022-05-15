const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const auth = require("../../middleware/auth");
// Player Model

const Player = require("../../models/Player");
const { parseQuery } = require("../../utility");

// @route POST api/users
// @desc Register New User
// @acces Public
router.post("/register", async (req, res) => {
  console.log(req.body);
  const { name, email, password, active } = req.body;
  // Verify URL
  // const query = stringify({
  //   secret: config.get("reCAPTCHA"),
  //   response: req.body.token,
  //   remoteip: req.connection.remoteAddress
  // });
  // const verifyURL = `${config.get("verifyURL")}${query}`;
  // //console.log(verifyURL);
  // const body = await axios.get(verifyURL);
  //console.log(body.data);
  // if (body.data.success !== undefined && !body.data.success) {
  //   return res.status(400).json({ msg: "Failed captcha verification" });
  // }

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check for exitsting user
  let player = await Player.findOne(
    { where: { email: `${email}` } },
    { plain: true }
  );
  if (player) {
    return res.status(400).json({ msg: "User alerady exists." });
  }

  // const newUser = new User({
  //   name,
  //   email,
  //   password
  // });
  const newPlayer = Player.build({
    name: `${name}`,
    phone: `${email}`,
    password: `${password}`,
    active: `${active}`,
  });

  // Create salt and hash

  bcryptjs.genSalt(10, (err, salt) => {
    bcryptjs.hash(newPlayer.password, salt, (err, hash) => {
      if (err) throw err;
      newPlayer.password = hash;
      newPlayer.save().then((player) => {
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
                phone: player.phone,
                active: player.active,
              },
            });
          }
        );
      });
    });
  });
});

router.get("/", auth, async (req, res) => {
  const parsedQuery = parseQuery(req.query);
  // console.log(parsedQuery);
  let player = await Player.findAll({
    where: parseQuery.filter,
    order: parsedQuery.order,
    offset: parseQuery.offset,
    limit: parseQuery.limit,
    raw: true,
    //plain: true,
  });

  if (player.active === false) {
    return res
      .status(400)
      .json({ msg: "Please activate your account", status: "ERR" });
  }

  res.setHeader("X-Total-Count", player.length);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(player));
});

router.get("/:id", auth, async (req, res) => {
  let player = await Player.findAll({
    where: {
      id: req.params.id,
    },
    plain: true,
  });

  if (player.active === false) {
    return res
      .status(400)
      .json({ msg: "Please activate your account", status: "ERR" });
  }

  res.json(player);

  // User.findById(req.user.id)
  //   .select("-password")
  //   .then(user => res.json(user));
});

module.exports = router;
