const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const Player = require("./model/player");

require("dotenv").config();

const innitConnection = require("./db")

const app = express();

const routes = require("./routes");

app.use(cors());
app.use(bodyParser.json()); //TODO: remove

const getRandomInt  = (max) => {
  return Math.floor(Math.random() * max);
}

const setupDB = async () => {
  const players = await Player.find();
  for (let player of players) {
    //remove existing scores
    player.scores = []
    
    // 2018
    let date = new Date(2018, 11, 26, 20, 0, 0, 0);
    for (let i= 0; i < 8; i++) {
      player.scores.push({amount: 1 + getRandomInt(7), date: date})
    }

    // 2019
    date = new Date(2019, 11, 26, 20, 0, 0, 0);
    for (let i= 0; i < 6; i++) {
      player.scores.push({amount: 1 + getRandomInt(7), date: date})
    }

    // 2020
    date = new Date(2020, 11, 26, 20, 0, 0, 0);
    for (let i= 0; i < 7; i++) {
      player.scores.push({amount: 1 + getRandomInt(7), date: date})
    }

    await player.save();
  }
}


const startServer = function () {
  app.use("/api", routes);

  const path = __dirname + '/dist/';

  app.use(express.static(path));
  
  app.get("/.*/", (req, res) => {
    res.sendFile(path + "index.html");
  });
  
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });

  
  if (process.argv && process.argv[0] != null) {
    setupDB();
  }
}

innitConnection(function () {
  startServer()
});

