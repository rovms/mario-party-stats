const express = require("express");
const router = express.Router();
const Player = require("../model/player");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const initConnection = require("../db");

// Retrieve all players
router.get("/player", auth, async (req, res) => {
  try {
    const players = await Player.find();
    return res.status(200).json(players);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post("/player", auth, async (req, res) => {
  try {
    const now = new Date();
    let player;

    const invalidPlayers = req.body.filter((player) => {
      if (player.newPoints < 0 || player.newPoints > 7) {
        return player;
      }
    });
    if (invalidPlayers) {
      const errorBody = [];
      for (let invalidPlayer of invalidPlayers) {
        errorBody.push({ name: invalidPlayer.name, newPoints: invalidPlayer.newPoints });
      }
      return res.status(400).send({ message: "Invalid points amount.", players: errorBody });
    }
    for (player of req.body) {
      const p = await Player.findById(player.id);
      p.scores.push({ amount: player.newPoints, date: now });
      await p.save();
    }
    return res.status(200).json("Ok");
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

router.post("/login", async (req, res) => {
  if (req.body.password !== process.env.SECRET) {
    return res.status(401).send("Wrong password.");
  }
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (!ip) {
    return res.status(401).send("IP could not be read.");
  }
  const token = jwt.sign({ ip }, process.env.JWT_SECRET, {
    expiresIn: "6 hours",
  });
  console.log(token);
  return res.status(200).json({ token });
});

module.exports = router;
