import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { connectionDB } from "./db/index";
import * as dotenv from "dotenv";
import router from "./router/index";
import handleCornTicket from "./helper/cronTicket";
const rateLimit = require("express-rate-limit");

dotenv.config();
process.env.UV_THREADPOOL_SIZE = "6";
connectionDB();
handleCornTicket();

const app = express();
app.use(
  cors({
    origin: [
      "http://192.168.41.26:3000",
      "http:localhost:3000",
      "https://datvemaybayonline.000webhostapp.com",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use("/", router());

const server = http.createServer(app);
const port = process.env.PORT;
server.listen(port, () => {
  console.log("POST:: ", port);
});
