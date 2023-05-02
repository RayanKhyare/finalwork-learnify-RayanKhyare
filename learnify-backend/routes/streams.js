const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const prisma = new PrismaClient();
const { streamValidation } = require("../validation");
const verify = require("./verifyToken");

router.get("/", async (req, res) => {
  const stream = await prisma.streams.findMany();
  res.json(stream);
});

router.get("/:streamId", async (req, res) => {
  const { streamId } = req.params;
  const stream = await prisma.streams.findUnique({
    where: { id: parseInt(streamId) },
  });
  if (stream) {
    res.json(stream);
  } else {
    res.status(404).json({ message: "Stream not found" });
  }
});

router.post("/", verify, async (req, res) => {
  //Validate schema

  const { user_id, category_id, title, description, iframe } = req.body;

  const { error } = streamValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const stream = await prisma.streams.create({
    data: {
      user_id,
      category_id,
      title,
      description,
      iframe,
    },
  });
  try {
    res.send(stream);
  } catch {
    res.status(400).send(err);
  }
});

module.exports = router;
