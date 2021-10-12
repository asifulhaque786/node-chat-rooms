const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);

const io = socketio(server); //we need raw server while express implicitly does http of above line
const port = process.env.PORT || 3001;
const publicDirectory = path.join("__dirname", "../public");
const Filter = require("bad-words");
const { addUser, findInRoom, findUser, removeUser } = require("./utils/users");
const { getMessage, generateLocation } = require("./utils/messages");

const filter = new Filter();
app.use(express.static(publicDirectory));

const welcome = "Hi there you are welcomed";
io.on("connection", (socket) => {
  console.log("new web socket connection");
  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser(socket.id, username, room);
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    
    socket.emit("message", getMessage(welcome, "Admin"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        getMessage(`${user.username} has joined the room`, "Admin")
      );
    io.to(user.room).emit("roomdata", {
      users: findInRoom(user.room),
      room: user.room,
    });
    callback();
  });
  socket.on("data", (data) => {
    // console.log(data)
    io.emit("data", data);
  });
  socket.on("sendmessage", (message, callback) => {
    // count++;
    // socket.emit('countupdated',count)
    if (filter.isProfane(message)) return callback("hasrh words not  to used!");
    const user = findUser(socket.id);
    io.to(user.room).emit("message", getMessage(message, user.username));
    callback("delivered!");
  });
  socket.on("disconnect", () => {
    const { user } = removeUser(socket.id);
    if (user) {
      socket.broadcast
        .to(user.room)
        .emit("message", getMessage(` ${user.username} has left`, "Admin"));
      io.to(user.room).emit("roomdata", {
        users: findInRoom(user.room),
        room: user.room,
      });
    }
  });
  socket.on("location", (l, callback) => {
    const user = findUser(socket.id);
    socket.broadcast
      .to(user.room)
      .emit(
        "locationformat",
        generateLocation(
          "https://google.com/maps?q=" + l.lat + "," + l.long,
          user.username
        )
      );
    callback();
  });
});

server.listen(port, (req, res) => {
  console.log("listening at " + port);
});
