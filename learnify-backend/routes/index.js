const router = require("express").Router();

//Import routes
const authRoute = require("./auth");
const postRoute = require("./posts");
const streamRoute = require("./streams");
const userRoute = require("./user");

router.use("/auth", authRoute);
router.use("/posts", postRoute);
router.use("/streams", streamRoute);
router.use("/users", userRoute);

module.exports = router;
