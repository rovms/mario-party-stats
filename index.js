const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const innitConnection = require("./db")

const app = express();

const routes = require("./routes");

app.use(cors());
app.use(bodyParser.json()); //TODO: remove

const startServer = function () {
  app.use("/api", routes);
  
  app.use(express.static(__dirname + "/dist/"));
  
  app.get("/.*/", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html");
  });
  
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });
}

innitConnection(function () {
  startServer()
});

