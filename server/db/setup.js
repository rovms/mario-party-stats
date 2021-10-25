
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


module.exports = setupDB;