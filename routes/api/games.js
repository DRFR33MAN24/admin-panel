const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");

const { Game, Player } = require("../../models");
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
router.get("/getGamePlayers", auth, async (req, res) => {
  console.log("getGamePlayers called");
  const gameId = req.query.gameId;
  if (!gameId) {
    return res.json(JSON.stringify({ status: 404 }));
  }
  try {
    let game = await Game.findByPk(gameId);
    let players = await game.getPlayers();
    //console.log(players);
    res.json(players);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", auth, async (req, res) => {
  console.log("getting a game by id");
  const id = req.params.id;
  if (!id) {
    return res.json(JSON.stringify({ status: 404 }));
  }
  try {
    let game = await Game.findAll({
      where: {
        id: id,
      },
      plain: true,
    });

    if (!game) {
      return res.status(404).json({ msg: "Not Found" });
    }
    res.json(game);
  } catch (error) {
    console.log(error);
    return res.json(JSON.stringify({ status: 500 }));
  }
});

router.put("/:id", auth, async (req, res) => {
  console.log("update route called");
  const { name, pictures } = req.body;

  if (!name) {
    return res.json(JSON.stringify({ status: 400 }));
  }

  try {
    let game = await Game.findOne({
      where: { id: req.params.id },
      raw: true,
      plain: true,
    });

    let imageHash = "";
    if (pictures) {
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
  } catch (error) {
    console.log(error);
    return res.json(JSON.stringify({ status: 500 }));
  }
  //console.log(player);
});

router.post("/", auth, async (req, res) => {
  console.log("create route called");
  const { name, pictures } = req.body;
  if (!name) {
    return res.json(JSON.stringify({ status: 400 }));
  }
  let imageHash = "";
  if (pictures) {
    imageHash = saveProfileImage(pictures, "");
  }
  try {
    await Game.create({
      name: name,

      profileImg: imageHash,
    });
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(req.body));
  } catch (error) {
    console.log(error);
    return res.json(JSON.stringify({ status: 500 }));
  }
});

router.post("/addPlayer", auth, async (req, res) => {
  console.log("addPlayer route called");
  const { playerId, gameId } = req.body;
  if (!playerId || !gameId) {
    return res.json({ status: 404 });
  }
  try {
    const game = await Game.findByPk(gameId);
    game.addPlayer(await Player.findByPk(playerId));
  } catch (error) {
    console.log(error);
  }
});
router.post("/deletePlayer", auth, async (req, res) => {
  console.log("deletePlayer route called");
  const { playerId, gameId } = req.body;
  if (!playerId || !gameId) {
    return res.json({ status: 404 });
  }
  try {
    const game = await Game.findByPk(gameId);
    game.removePlayer(await Player.findByPk(playerId));
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
