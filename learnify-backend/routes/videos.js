const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const prisma = new PrismaClient();
const { videoValidation } = require("../validation");
const verify = require("./verifyToken");

router.get("/", async (req, res) => {
  const videos = await prisma.videos.findMany();
  res.json(videos);
});

router.post("/", async (req, res) => {
  //Validate schema
  const { user_id, category_id, title, description, iframe } = req.body;

  const { error } = videoValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const video = await prisma.videos.create({
    data: {
      user_id,
      category_id,
      title,
      description,
      iframe,
    },
  });
  try {
    res.send(video);
  } catch {
    res.status(400).send(err);
  }
});

module.exports = router;
