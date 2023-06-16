const app = require("./app.js");
const socketServer = require("./socketServer");

const SERVERPORT = 4000;
const SOCKETPORT = 5000;

app.listen(SERVERPORT, () => console.log("Server up and running"));

// Start the SocketIo server
socketServer.listen(SOCKETPORT, () => {
  console.log("SocketIo server started");
});
