// server.js
import http from "http";
import { Server } from "socket.io";
import connectDb from "./config/db.js";
import app from "./app.js";

const port = process.env.PORT || 5000;
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

export const userSocketMap = new Map();

io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    userSocketMap.set(userId, socket.id);
    console.log("User registered:", userId, socket.id);
  });

  socket.on("disconnect", () => {
    for (let [key, value] of userSocketMap.entries()) {
      if (value === socket.id) {
        userSocketMap.delete(key);
        console.log("User disconnected:", key, socket.id);
        break;
      }
    }
  });
});

server.listen(port, () => {
  connectDb();
  console.log(`Server started at port ${port}`);
});
