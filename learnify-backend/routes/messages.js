const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const verify = require("./verifyToken");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const messages = await prisma.messages.findMany();
  res.json(messages);
});

router.post("/", async (req, res) => {
  //Validate schema

  const { username, stream_id, message } = req.body;

  const messageBody = await prisma.messages.create({
    data: {
      username,
      stream_id,
      message,
    },
  });
  try {
    res.send(messageBody);
  } catch {
    res.status(400).send(err);
  }
});

router.get("/stream/:stream_id", async (req, res) => {
  const { stream_id } = req.params;

  const messages = await prisma.messages.findMany({
    where: {
      stream_id: parseInt(stream_id),
    },
  });

  res.json(messages);
});

module.exports = router;
