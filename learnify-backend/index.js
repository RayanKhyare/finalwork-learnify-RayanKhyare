const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//Import routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

//Route middlewares
app.use(express.json());
app.use("/auth", authRoute);
app.use("/posts", postRoute);

app.listen(3000, () => console.log("Server up and running"));
