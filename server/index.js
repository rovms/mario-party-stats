const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const connectHistoryApiFallback = require("connect-history-api-fallback");
const Player = require("./model/player");

require("dotenv").config();

const innitConnection = require("./db");

const app = express();

const routes = require("./routes");

app.use(cors());
app.use(bodyParser.json()); //TODO: remove
app.use(morgan());
app.use(connectHistoryApiFallback());

const startServer = function () {
  app.use("/api", routes);

  if (process.env.NODE_ENV === "production") {
    const path = __dirname + "/dist/";
    app.use(express.static(path));
    app.get("/.*/", (req, res) => {
      res.sendFile(path + "index.html");
    });
  }

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });
};

innitConnection(function () {
  startServer();
});
