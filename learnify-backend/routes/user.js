const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const {
  registerValidation,
  loginValidation,
  updateValidation,
} = require("../validation");
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

router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const { email, username, password, profile_pic } = req.body;

  // Validate schema
  const { error } = updateValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if email is already in use by another user
  const emailExist = await prisma.users.findFirst({
    where: { email, id: { not: parseInt(userId) } },
  });
  if (emailExist) return res.status(400).send("Email already exists");

  // Check if the new password is the same as the existing password

  let hashedPassword = null;
  if (password) {
    const user = await prisma.users.findUnique({
      where: { id: parseInt(userId) },
    });

    console.log(password);
    console.log(user.password);
    // Compare the new password with the existing password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (password === user.password) {
      // If the new password is the same as the existing password, set hashedPassword to the existing password
      hashedPassword = user.password;
    } else {
      // Encrypt the new password
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }
  }

  // Update the user
  const updatedUser = await prisma.users.update({
    where: { id: parseInt(userId) },
    data: {
      email,
      username,
      profile_pic,
      ...(hashedPassword && { password: hashedPassword }),
    },
  });

  try {
    res.send(updatedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Delete the streams associated with the user
    await prisma.streams.deleteMany({
      where: { user_id: parseInt(userId) },
    });

    await prisma.videos.deleteMany({
      where: { user_id: parseInt(userId) },
    });

    // Delete the polls associated with the user's streams
    await prisma.polls.deleteMany({
      where: {
        stream: {
          user_id: parseInt(userId),
        },
      },
    });

    // Delete the poll options associated with the user's streams
    await prisma.poll_option.deleteMany({
      where: {
        poll: {
          stream: {
            user_id: parseInt(userId),
          },
        },
      },
    });

    // Delete the poll votes associated with the user's streams
    await prisma.poll_votes.deleteMany({
      where: {
        poll: {
          stream: {
            user_id: parseInt(userId),
          },
        },
      },
    });

    // Delete the questions associated with the user's streams
    await prisma.questions.deleteMany({
      where: {
        stream: {
          user_id: parseInt(userId),
        },
      },
    });

    // Delete the answers associated with the user's streams
    await prisma.answers.deleteMany({
      where: {
        question: {
          stream: {
            user_id: parseInt(userId),
          },
        },
      },
    });

    // Delete the user
    await prisma.users.delete({
      where: { id: parseInt(userId) },
    });

    res.json({
      message:
        "User, streams, polls, poll options, poll votes, questions, and answers deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "Failed to delete the user, streams, polls, poll options, poll votes, questions, and answers.",
    });
  }
});

module.exports = router;
