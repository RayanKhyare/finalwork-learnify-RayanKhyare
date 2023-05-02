const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");
const verify = require("./verifyToken");

router.get("/", async (req, res) => {
  const users = await prisma.users.findMany();
  res.json(users);
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await prisma.users.findUnique({
    where: { id: parseInt(userId) },
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = router;
