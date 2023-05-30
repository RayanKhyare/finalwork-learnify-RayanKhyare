const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const verify = require("./verifyToken");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

router.get("/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) },
  });
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ message: "Category not found" });
  }
});

module.exports = router;
