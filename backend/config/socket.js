import { Server } from "socket.io";

const configureSocketIo = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("new-thread", (threadId) => {
      socket.broadcast.to(threadId).emit("new-thread", threadId);
    });

    socket.on("thread-change", (threadId) => {
      socket.leave(socket.previousRoom);
      socket.join(threadId);
      socket.previousRoom = threadId;
    });
  });
};

export { configureSocketIo };
