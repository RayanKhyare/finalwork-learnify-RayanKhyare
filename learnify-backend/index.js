const app = require("./app.js");
const socketServer = require("./socketServer");

const PORT = process.env.PORT || 4000;
const SOCKETPORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server up and running"));

// Start the SocketIo server
socketServer.listen(SOCKETPORT, () => {
  console.log("SocketIo server started");
});
