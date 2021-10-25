const mongoose = require("mongoose");

const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}
const DB_URL = process.env.DB_URL;

const initConnection = function(callback) {
    mongoose.connect(DB_URL, CONFIG)
    const db = mongoose.connection;
    
    db.on('error', function (err) {
      console.error('Failed to connect to database');
      process.exit(1);
    });
  
    db.once('open', function () {
        console.log('DB connected.')
        callback()
    });
};
  
module.exports = initConnection