const express = require("express");
const path = require("path");
const http = require("http");
const app = express();
const socketio = require("socket.io");
const { Server } = require("socket.io");
require("dotenv").config();
require("./dummy_test"); // dummy file to test out things
const {
  genereateMessage,
  generateLocationMessage,
} = require("./utils/message");

const server = http.createServer(app);
const io = socketio(server);
const cssPath = path.join(__dirname, "../public/css/style.css");
const iconPath = path.join(__dirname, "../public/img");

app.use(express.static(iconPath));
app.use(express.static("public"));
io.on("connection", (socket) => {
console.log("web socket connection");

  
  socket.on("join", ({ username, room }) => {
    socket.join(room);
    socket.emit("message", genereateMessage("Welcome!"));
  socket.broadcast.to(room).emit("message", genereateMessage(`${username} has joined`));
  });
  socket.on("clientMessage", (clientMessage, callback) => {
    io.to('chat').emit("message", genereateMessage(clientMessage));
    callback();
  });

  socket.on("sendLocation", (clientLocation, callback) => {
    io.emit("locationMessage", generateLocationMessage(clientLocation));
    callback();
  });
  socket.on("disconnect", () => {
    io.emit("message", genereateMessage("user has left"));
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on PORT ${process.env.PORT}`);
});
