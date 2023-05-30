const router = require("express").Router();

//Import routes
const authRoute = require("./auth");
const postRoute = require("./posts");
const streamRoute = require("./streams");
const userRoute = require("./user");
const answerRoute = require("./answers");
const questionRoute = require("./questions");
const videoRoute = require("./videos");
const categoryRoute = require("./categories");
const messageRoute = require("./messages");
const pollRoute = require("./polls");

router.use("/auth", authRoute);
router.use("/posts", postRoute);
router.use("/streams", streamRoute);
router.use("/users", userRoute);
router.use("/answers", answerRoute);
router.use("/questions", questionRoute);
router.use("/videos", videoRoute);
router.use("/categories", categoryRoute);
router.use("/messages", messageRoute);
router.use("/polls", pollRoute);

module.exports = router;
