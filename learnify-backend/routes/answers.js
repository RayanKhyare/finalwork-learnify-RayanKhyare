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

  const { question_id, user_id, answer } = req.body;

  const answerBody = await prisma.answers.create({
    data: {
      question_id,
      user_id,
      answer,
    },
  });
  try {
    res.send(answerBody);
  } catch {
    res.status(400).send(err);
  }
});

module.exports = router;
