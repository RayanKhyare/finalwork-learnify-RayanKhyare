const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const prisma = new PrismaClient();
const { streamValidation } = require("../validation");
const verify = require("./verifyToken");

router.get("/", async (req, res) => {
  const questions = await prisma.questions.findMany();
  res.json(questions);
});

router.post("/", async (req, res) => {
  //Validate schema

  const { stream, question, time } = req.body;

  const questionBody = await prisma.questions.create({
    data: {
      stream: { connect: { id: stream } },
      question,
      time,
    },
  });
  try {
    res.send(questionBody);
  } catch {
    res.status(400).send(err);
  }
});

router.get("/stream/:streamId", async (req, res) => {
  const { streamId } = req.params;

  try {
    const questions = await prisma.questions.findMany({
      where: {
        stream: {
          id: parseInt(streamId),
        },
      },
    });

    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
