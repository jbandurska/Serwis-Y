import { Server } from "socket.io";

const configureSocketIo = async (server, passport) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);

  const sessionMiddleware = (await import("../middleware/sessionMiddleware.js"))
    .sessionMiddleware;
  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  io.use((socket, next) => {
    if (socket.request.user) {
      next();
    } else {
      next(new Error("Unauthorized!"));
    }
  });

  io.on("connection", (socket) => {
    // for new threads by people that we follow
    socket.on("new-thread", () => {
      const userId = socket.request.user._id;
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
