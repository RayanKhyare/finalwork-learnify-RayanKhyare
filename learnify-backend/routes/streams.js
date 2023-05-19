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

router.post("/", async (req, res) => {
  //Validate schema

  const { user_id, category_id, room_id, title, description, iframe } =
    req.body;

  const { error } = streamValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const stream = await prisma.streams.create({
    data: {
      user_id,
      category_id,
      room_id,
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

router.get("/user/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const streams = await prisma.streams.findMany({
      where: {
        user_id: parseInt(user_id),
      },
    });

    res.send(streams);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.put("/:streamId", async (req, res) => {
  const { streamId } = req.params;
  const { user_id, category_id, room_id, title, description, iframe } =
    req.body;

  // const { error } = streamValidation(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  const updatedStream = await prisma.streams.update({
    where: { id: parseInt(streamId) },
    data: { user_id, category_id, room_id, title, description, iframe },
  });
  try {
    res.send(updatedStream);
  } catch {
    res.status(400).send(err);
  }
});

router.delete("/:streamId", async (req, res) => {
  const { streamId } = req.params;

  try {
    const deletedStream = await prisma.streams.delete({
      where: { id: parseInt(streamId) },
    });

    res.json({ message: "Stream deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
