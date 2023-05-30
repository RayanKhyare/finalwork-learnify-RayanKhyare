const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const prisma = new PrismaClient();
const { videoValidation } = require("../validation");
const verify = require("./verifyToken");

router.get("/", async (req, res) => {
  const videos = await prisma.videos.findMany();
  res.json(videos);
});

router.get("/:videoId", async (req, res) => {
  const { videoId } = req.params;

  try {
    const video = await prisma.videos.findUnique({
      where: { id: parseInt(videoId) },
    });

    if (video) {
      res.json(video);
    } else {
      res.status(404).send("Video not found");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
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

router.put("/:videoId", async (req, res) => {
  const { videoId } = req.params;
  const { user_id, category_id, title, description, iframe } = req.body;

  const updatedVideo = await prisma.videos.update({
    where: { id: parseInt(videoId) },
    data: { user_id, category_id, title, description, iframe },
  });
  try {
    res.send(updatedVideo);
  } catch {
    res.status(400).send(err);
  }
});

router.get("/user/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const videos = await prisma.videos.findMany({
      where: {
        user_id: parseInt(user_id),
      },
    });

    res.send(videos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.get("/category/:category_id", async (req, res) => {
  const { category_id } = req.params;

  try {
    const videos = await prisma.videos.findMany({
      where: {
        category_id: parseInt(category_id),
      },
    });

    res.send(videos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.delete("/:videoId", async (req, res) => {
  const { videoId } = req.params;

  try {
    // Delete the stream
    await prisma.videos.delete({
      where: { id: parseInt(videoId) },
    });

    res.json({
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
