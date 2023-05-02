const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");

dotenv.config();

//Route middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/api/v1", routes);

module.exports = app;
