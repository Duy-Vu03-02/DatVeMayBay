import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { connectionDB } from "./db/index";
import * as dotenv from "dotenv";
import router from "./router/index";
import handleCornTicket from "./helper/cronTicket";

dotenv.config();
process.env.UV_THREADPOOL_SIZE = "6";
connectionDB();
handleCornTicket();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.41.26:3000"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/", router());

const server = http.createServer(app);
const port = process.env.PORT;
server.listen(port, () => {
  console.log("POST:: ", port);
});
