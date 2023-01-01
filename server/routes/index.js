const express = require("express");
const router = express.Router();
const Player = require("../model/player");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

router.post("/score", auth, async (req, res) => {
  try {
    const payload = req.body;
    const invalidPlayers = [];
    let player;
    for (player of payload.players) {
      if (player.newPoints < 0 || player.newPoints > 7) {
        invalidPlayers.push(player); 
      }
    }
    if (invalidPlayers && invalidPlayers.length > 0) {
      const errorBody = [];
      for (let invalidPlayer of invalidPlayers) {
        errorBody.push({ name: invalidPlayer.name, newPoints: invalidPlayer.newPoints });
      }
      return res.status(400).send({ message: "Invalid points amount.", players: errorBody });
    }
    const date = payload.date || new Date();
    for (player of payload.players) {
      const p = await Player.findById(player.id);
      p.scores.push({ amount: player.newPoints, date: date });
      await p.save();
    }
    return res.status(200).json("Ok");
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

router.get("/score", auth, async (req, res) => {
  try {
    const players = await Player.find();
    return res.status(200).json(players);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post("/login", async (req, res) => {
  if (req.body.password !== process.env.SECRET) {
    return res.status(401).send("Wrong password.");
  }
  const token = jwt.sign({ payload: "No data" }, process.env.JWT_SECRET);
  return res.status(200).json({ token });
});

module.exports = router;
