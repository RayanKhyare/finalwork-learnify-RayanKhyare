const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const verify = require("./verifyToken");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const files = await prisma.file.findMany();
  res.json(files);
});

router.post("/", async (req, res) => {
  //Validate schema

  const { stream_id, filename, url } = req.body;

  const fileBody = await prisma.file.create({
    data: {
      stream: { connect: { id: stream_id } },
      filename,
      url,
    },
  });
  try {
    res.send(fileBody);
  } catch {
    res.status(400).send(err);
  }
});

router.get("/stream/:streamId", async (req, res) => {
  const streamId = parseInt(req.params.streamId);

  try {
    const file = await prisma.file.findFirst({
      where: {
        stream_id: streamId,
      },
    });

    if (file) {
      res.json(file);
    } else {
      res.status(404).json({ error: "No file found for the given stream ID" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
