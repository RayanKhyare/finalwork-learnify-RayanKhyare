const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const verify = require("./verifyToken");
const prisma = new PrismaClient();

// Get all categories
router.get("/", async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

// Get a specific category by ID
router.get("/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) },
  });
  if (category) {
    res.json(category); // Return the category if found
  } else {
    res.status(404).json({ message: "Category not found" }); // Return a 404 status and an error message if the category is not found
  }
});

module.exports = router;
