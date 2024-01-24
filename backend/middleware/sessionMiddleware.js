import session from "express-session";

const sessionMiddleware = session({
  name: "session",
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: "None",
  },
});

export { sessionMiddleware };
