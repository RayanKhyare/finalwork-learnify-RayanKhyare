import io from "socket.io-client";

// const socket = io.connect("http://localhost:5000");

const socket = io.connect(
  "https://finalwork-learnify-rayankhyare-production.up.railway.app/"
);

export default socket;
