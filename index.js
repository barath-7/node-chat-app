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
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users");

const server = http.createServer(app);
const io = socketio(server);
const cssPath = path.join(__dirname, "../public/css/style.css");
const iconPath = path.join(__dirname, "../public/img");

app.use(express.static(iconPath));
app.use(express.static("public"));
io.on("connection", (socket) => {
  console.log("web socket connection");

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    socket.emit("message", genereateMessage("Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit("message", genereateMessage(`${user.username} has joined`));
      io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
      })
    callback();
  });
  socket.on("clientMessage", (clientMessage, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", genereateMessage(user.username,clientMessage));
    callback();
  });

  socket.on("sendLocation", (clientLocation, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("locationMessage", generateLocationMessage(user.username,clientLocation));
    callback();
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        genereateMessage(`${user.username} has left`)
      );
      io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
      })
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on PORT ${process.env.PORT}`);
});
