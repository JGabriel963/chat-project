import "dotenv/config";
import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "@/middlewares/socket-auth-middleware";
import { app } from "@/app";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL!],
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

// this is for storing online users
const userSocketMap: Record<string, string> = {};

export function getReceiverSocketId(receiverId: string) {
  return userSocketMap[receiverId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.user?.name);

  const userId = socket.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Array de key (id dos usuário, no caso)

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user?.name);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, server, app };
