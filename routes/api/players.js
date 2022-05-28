const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const upload = multer();
const auth = require("../../middleware/auth");
const { uuid } = require("uuidv4");
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
  console.log("getting a record", req.params);
  let player = await Player.findAll({
    where: {
      id: req.params.id,
    },
    plain: true,
  });
  console.log("player", player);

  if (!player) {
    return res.status(404).json({ msg: "Not Found" });
  }
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

const saveProfileImage = (pictures, oldImage) => {
  let imageHash = uuid();

  var data = pictures[0].src.split(";base64,").pop();
  var buf = Buffer.from(data, "base64");

  fs.writeFile(__dirname + "/public/" + imageHash, buf, function (err) {
    console.log("Image created");
    if (oldImage !== "") {
      fs.unlink(__dirname + "/public/" + oldImage, (err) => {
        if (err) {
          console.log(err);
          return;
        } //handle your error the way you want to;
        console.log("Image was deleted"); //or else the file will be deleted
      });
    }
  });
  return imageHash;
};

router.put("/:id", auth, async (req, res) => {
  console.log("update route called", req.params);
  const { new_password, active, name, email, pictures } = req.body;

  let player = await Player.findOne({
    where: { id: req.params.id },
    raw: true,
    plain: true,
  });
  //console.log(player);
  let imageHash = "";
  if (pictures !== undefined) {
    imageHash = saveProfileImage(pictures, player.profileImg);
  }

  let salt = await bcryptjs.genSalt(10);
  let hash = await bcryptjs.hash(new_password, salt);
  await Player.update(
    {
      password: hash,
      name: name,
      active: active,
      email: email,
      profileImg: imageHash,
    },
    {
      where: { id: req.params.id },
    }
  );
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(req.body));
});
router.post("/", auth, async (req, res) => {
  console.log("create route called");
  const { new_password, active, name, email, pictures } = req.body;

  let imageHash = "";
  if (pictures !== undefined) {
    imageHash = saveProfileImage(pictures, "");
  }

  let salt = await bcryptjs.genSalt(10);
  let hash = await bcryptjs.hash(new_password, salt);
  await Player.update(
    {
      password: hash,
      name: name,
      active: active,
      email: email,
      profileImg: imageHash,
    },
    {
      where: { id: req.params.id },
    }
  );
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(req.body));
});

module.exports = router;
