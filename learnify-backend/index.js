const app = require("./app.js");
const socketServer = require("./socketServer");

const port = process.env.PORT || 4000;
const socketPort = process.env.SOCKETPORT || 5000;

if (process.env.RAILWAY === "socket") {
  socketServer.listen(socketPort, () => {
    console.log("Socket server started");
  });
} else {
  app.listen(port, () => {
    console.log("Server up and running");
  });
}
