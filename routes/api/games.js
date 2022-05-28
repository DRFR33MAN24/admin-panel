const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");

// Player Model

const Game = require("../../models");
const { parseQuery, saveProfileImage } = require("../../utility");

router.get("/", auth, async (req, res) => {
  const parsedQuery = parseQuery(req.query);
  // console.log(parsedQuery);
  let games = await Game.findAll({
    where: parseQuery.filter,
    order: parsedQuery.order,
    offset: parseQuery.offset,
    limit: parseQuery.limit,
    raw: true,
    //plain: true,
  });

  res.setHeader("X-Total-Count", games.length);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(games));
});

router.get("/:id", auth, async (req, res) => {
  console.log("getting a game by id");
  let game = await Game.findAll({
    where: {
      id: req.params.id,
    },
    plain: true,
  });

  if (!game) {
    return res.status(404).json({ msg: "Not Found" });
  }

  res.json(game);
});

router.put("/:id", auth, async (req, res) => {
  console.log("update route called");
  const { new_password, active, name, email, pictures } = req.body;

  let game = await Game.findOne({
    where: { id: req.params.id },
    raw: true,
    plain: true,
  });
  //console.log(player);
  let imageHash = "";
  if (pictures !== undefined) {
    imageHash = saveProfileImage(pictures, game.profileImg);
  } else {
    imageHash = player.profileImg;
  }

  let salt = await bcryptjs.genSalt(10);
  let hash = await bcryptjs.hash(new_password, salt);
  await Game.update(
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
  const { password, active, name, email, pictures } = req.body;

  let imageHash = "";
  if (pictures !== undefined) {
    imageHash = saveProfileImage(pictures, "");
  }

  let salt = await bcryptjs.genSalt(10);
  let hash = await bcryptjs.hash(password, salt);
  await Game.create({
    password: hash,
    name: name,
    active: active,
    email: email,
    profileImg: imageHash,
  });
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(req.body));
});

module.exports = router;
