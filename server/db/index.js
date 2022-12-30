const mongoose = require("mongoose");

require("dotenv").config();

const DB_URL = process.env.DB_URL;
const CONFIG = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	dbName: process.env.DB_NAME,
};

const initConnection = function (callback) {
	mongoose
		.connect(DB_URL, CONFIG)
		.then(() => {
			console.log("DB Name: " + mongoose.connection.name);
			callback();
		})
		.catch((err) => {
			console.error("Failed to connect to database");
			console.error(err);
			process.exit(1);
		});
};

module.exports = initConnection;
