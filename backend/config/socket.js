import { Server } from "socket.io";

const configureSocketIo = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // for new threads by people that we follow
    socket.on("new-thread", (userId) => {
      socket.broadcast.to(`user:${userId}`).emit("new-thread");
    });

    // for new subthreads of thread we're currently browsing
    socket.on("new-subthread", (threadId) => {
      socket.broadcast.to(`thread:${threadId}`).emit("new-subthread");
    });

    // when we open a new thread in the browser
    socket.on("thread-change", (threadId) => {
      socket.leave(socket.previousThreadRoom);
      socket.join(`thread:${threadId}`);
      socket.previousThreadRoom = threadId;
    });

    // when app loads
    socket.on("notifications-init", (following) => {
      // if we have previous socket.following we'll leave those rooms
      // because user or the users they follow could have changed
      if (socket.following) {
        for (const userId of socket.following) {
          socket.leave(`user:${userId}`);
        }
      }

      // then we join the new ones
      if (Array.isArray(following)) {
        socket.following = following;

        for (const userId of following) {
          socket.join(`user:${userId}`);
        }
      }
    });
  });
};

export { configureSocketIo };
