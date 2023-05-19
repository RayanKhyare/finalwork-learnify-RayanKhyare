const http = require("http");
const express = require("express");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
app.use(cors());

io.on("connection", (socket) => {
  console.log(`We have a new connection : ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data.room);
    console.log(
      `User ${data.user} with role ${data.role} joined the room : ${data.room}`
    );
  });

  //Live chat
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  // Q&A
  socket.on("send_question", (data) => {
    const questionData = {
      question: data.question,
      timestamp: new Date().getTime(), // Get current timestamp
    };
    io.to(data.room).emit("receive_question", questionData);
  });

  socket.on("send_answer", (data) => {
    socket.to(data.room).emit("show_answers", data);
  });

  // Poll
  socket.on("send_poll", (data) => {
    io.to(data.room).emit("receive_poll", data);
  });

  socket.on("send_vote", (data) => {
    console.log(data);
    socket.to(data.room).emit("receive_vote", data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnect");
  });
});

module.exports = server;
