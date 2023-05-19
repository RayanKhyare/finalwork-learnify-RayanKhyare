const app = require("./app.js");
const socketServer = require("./socketServer");

app.listen(3000, () => console.log("Server up and running"));

// Start the SocketIo server
socketServer.listen(5000, () => {
  console.log("SocketIo server started");
});
