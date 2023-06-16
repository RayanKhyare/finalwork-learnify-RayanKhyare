const app = require("./app.js");
const socketServer = require("./socketServer");

const port = 4000;
const socketport = 5000;

app.listen(port, () => console.log("Server up and running"));

// Start the SocketIo server
socketServer.listen(socketport, () => {
  console.log("SocketIo server started");
});
