const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");

const { Game } = require("../../models");
const { parseQuery, saveProfileImage } = require("../../utility");

router.get("/", auth, async (req, res) => {
  const parsedQuery = parseQuery(req.query);

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
  const { name, pictures } = req.body;

  let game = await Game.findOne({
    where: { id: req.params.id },
    raw: true,
    plain: true,
  });
  //console.log(player);
  let imageHash = "";
  if (pictures !== undefined) {
    imageHash = saveProfileImage(pictures, game.gameImage);
  } else {
    imageHash = game.gameImage;
  }

  await Game.update(
    {
      name: name,

      gameImage: imageHash,
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
  const { name, pictures } = req.body;

  let imageHash = "";
  if (pictures !== undefined) {
    imageHash = saveProfileImage(pictures, "");
  }

  await Game.create({
    name: name,

    profileImg: imageHash,
  });
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(req.body));
});

module.exports = router;
