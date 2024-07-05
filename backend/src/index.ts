import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/", (req: Request, res: Response) => {
  return res.send("ddd");
});

const server = http.createServer(app);
server.listen(8080, () => {
  console.log("POST:: 8080");
});
