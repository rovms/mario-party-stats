const Player = require("../model/player");

const innitConnection = require("../db/index")

const doMigrate = async () => {
    const lastChristmas = new Date(2020, 11, 26, 20, 0, 0, 0);
    try {
      const players = await Player.find();
    
      let player;
      for (player of players) {
        for (let point of player.points) {
          player.scores.push({ amount: point, date: lastChristmas });
        }
        await player.save();
      }
    } catch (error) {
      console.error(error);
    }
}

innitConnection(doMigrate)
