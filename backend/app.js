import express from "express";
import fs from "fs";
import https from "https";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./db/dbConnection.js";
import { configurePassport } from "./config/passport.js";
import { authRouter, threadRouter, userRouter } from "./routes/index.js";
import fileUpload from "express-fileupload";
import { configureSocketIo } from "./config/socket.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const sessionMiddleware = (await import("./middleware/sessionMiddleware.js"))
  .sessionMiddleware;

app.use(sessionMiddleware);
app.use(fileUpload());

const passport = configurePassport(app);

app.use("/api", authRouter);
app.use("/api/users", userRouter);
app.use("/api/threads", threadRouter);

app.use(errorMiddleware);

app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

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

await configureSocketIo(server, passport);

await connectToDatabase();

server.listen(port, () => {
  console.log(`Listening on https://localhost:${port}`);
});
