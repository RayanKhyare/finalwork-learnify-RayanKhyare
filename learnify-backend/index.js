const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

//Import routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const streamRoute = require("./routes/streams");

//Route middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/auth", authRoute);
app.use("/posts", postRoute);
app.use("/streams", streamRoute);

app.listen(3000, () => console.log("Server up and running"));
