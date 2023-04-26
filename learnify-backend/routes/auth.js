const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");
const verify = require("./verifyToken");

router.get("/users", async (req, res) => {
  const users = await prisma.users.findMany();
  res.json(users);
});

router.post("/register", async (req, res) => {
  //Validate schema
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if email is already in DB
  const emailExist = await prisma.users.findUnique({
    where: { email: req.body.email },
  });
  if (emailExist) return res.status(400).send("Email already exists");

  //Hash password
  const salt = await bcrypt.genSalt(10);
  //Create a new user
  const { role, username, email } = req.body;
  password = await bcrypt.hash(req.body.password, salt);
  const user = await prisma.users.create({
    data: {
      role,
      username,
      email,
      password,
    },
  });
  try {
    res.send({ user: user.id });
  } catch {
    res.status(400).send(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if email exists
  const user = await prisma.users.findUnique({
    where: { email: req.body.email },
  });
  if (!user) return res.status(400).send("Email is not found");

  //Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  // Create and assign a token
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
    },
    process.env.TOKEN_SECRET
  );
  res.header("auth-token", token).send(token);
  // res.json({ accessToken: token });
});

router.get("/roles", verify, async (req, res) => {
  const roles = await prisma.roles.findMany();
  res.json(roles);
});

module.exports = router;
