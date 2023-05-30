const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const verify = require("./verifyToken");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const polls = await prisma.polls.findMany();
  res.json(polls);
});

router.post("/", async (req, res) => {
  const { stream_id, question, options } = req.body;

  const optionsData = options.map((option) => ({ option }));

  const pollBody = await prisma.polls.create({
    data: {
      stream_id,
      question,
      options: {
        create: optionsData,
      },
    },
    include: {
      options: true,
    },
  });

  try {
    res.send(pollBody);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/vote", async (req, res) => {
  const { user_id, poll_id, option_id } = req.body;

  try {
    // Check if the user has already voted for this poll
    const existingVote = await prisma.poll_votes.findFirst({
      where: {
        user_id,
        poll_id,
      },
    });

    if (existingVote) {
      return res
        .status(400)
        .json({ error: "User has already voted for this poll." });
    }

    // Create the poll vote
    const vote = await prisma.poll_votes.create({
      data: {
        user_id,
        poll_id,
        option_id,
      },
    });

    res.json(vote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit the poll vote." });
  }
});

router.get("/", async (req, res) => {
  const { stream_id } = req.query;

  try {
    // Retrieve the polls based on the provided stream_id
    const polls = await prisma.polls.findMany({
      where: {
        stream_id: parseInt(stream_id),
      },
    });

    res.json(polls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve the polls." });
  }
});

router.get("/stream/:stream_id", async (req, res) => {
  const { stream_id } = req.params;

  try {
    // Retrieve the polls based on the provided stream_id
    const polls = await prisma.polls.findMany({
      where: {
        stream_id: parseInt(stream_id),
      },
      include: {
        options: {
          include: {
            votes: true,
          },
        },
      },
    });

    res.json(polls);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to retrieve the polls, options, and votes." });
  }
});

router.delete("/stream/:stream_id/poll/:poll_id", async (req, res) => {
  const { stream_id, poll_id } = req.params;

  try {
    // Delete the votes associated with the specified poll options
    await prisma.poll_votes.deleteMany({
      where: {
        poll_id: parseInt(poll_id),
      },
    });

    // Delete the options associated with the specified poll
    await prisma.poll_option.deleteMany({
      where: {
        poll_id: parseInt(poll_id),
      },
    });

    // Delete the specified poll
    await prisma.polls.delete({
      where: {
        id: parseInt(poll_id),
      },
    });

    res.json({ message: "Poll, options, and votes deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to delete the poll, options, and votes." });
  }
});

module.exports = router;
