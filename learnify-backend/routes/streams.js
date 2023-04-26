const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const stream = await prisma.streams.findMany();
  res.json(stream);
});

module.exports = router;
