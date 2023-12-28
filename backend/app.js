import express from "express";
import fs from "fs";
import https from "https";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT;
const passphrase = process.env.PASSPHRASE;

const app = express();

app.use(cors());

const key = fs.readFileSync("key.pem");
const cert = fs.readFileSync("cert.pem");

const server = https.createServer(
  {
    key,
    cert,
    passphrase,
  },
  app
);

server.listen(port, () => {
  console.log(`Listening on https://localhost:${port}`);
});
