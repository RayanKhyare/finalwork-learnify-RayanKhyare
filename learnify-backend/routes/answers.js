const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const prisma = new PrismaClient();
const { streamValidation } = require("../validation");
const verify = require("./verifyToken");

router.get("/", async (req, res) => {
  const answers = await prisma.answers.findMany();
  res.json(answers);
});

router.post("/", async (req, res) => {
  //Validate schema
  const { stream_id, question_id, username, answer } = req.body;

  const answerBody = await prisma.answers.create({
    data: {
      stream_id,
      question_id,
      username,
      answer,
    },
  });
  try {
    res.send(answerBody);
  } catch {
    res.status(400).send(err);
  }
});

router.get("/question/:streamId", async (req, res) => {
  const { streamId } = req.params;

  try {
    const answers = await prisma.answers.findMany({
      where: {
        stream_id: parseInt(streamId),
      },
    });

    res.json(answers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
