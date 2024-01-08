import express from "express";
import fs from "fs";
import https from "https";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import { connectToDatabase } from "./db/dbConnection.js";
import { configurePassport } from "./config/passport.js";
import { authRouter, threadRouter, userRouter } from "./routes/index.js";
import fileUpload from "express-fileupload";
import { configureSocketIo } from "./config/socket.js";

dotenv.config();
const port = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    name: "session",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "None",
    },
  })
);
app.use(fileUpload());

configurePassport(app);

app.use("/api", authRouter);
app.use("/api/users", userRouter);
app.use("/api/threads", threadRouter);

const key = fs.readFileSync("key.pem");
const cert = fs.readFileSync("cert.pem");

const server = https.createServer(
  {
    key,
    cert,
    passphrase: process.env.PASSPHRASE,
  },
  app
);

configureSocketIo(server);

await connectToDatabase();

server.listen(port, () => {
  console.log(`Listening on https://localhost:${port}`);
});
