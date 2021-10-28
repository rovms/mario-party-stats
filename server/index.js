const express = require("express");
const bodyParser = require("body-parser");
const historyFallback = require("connect-history-api-fallback");
const morgan = require("morgan");
const cors = require("cors");

const Player = require("./model/player");

require("dotenv").config();

const innitConnection = require("./db");

const app = express();
app.use(cors());
app.use(historyFallback);
app.use(morgan);

const routes = require("./routes");

const startServer = function () {
  app.use("/api", routes);

  const path = __dirname + "/dist/";

  app.use(express.static(path));

  app.get("/.*/", (req, res) => {
    res.sendFile(path + "index.html");
  });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });

  // if (process.argv && process.argv[0] != null) {
  //   setupDB();
  // }
};

innitConnection(function () {
  startServer();
});
