import express from "express";
import UserRoutes from "./UserRoutes";
import TicketRouter from "./TicketRouter";

const router = express.Router();

export default (): express.Router => {
  UserRoutes(router);
  TicketRouter(router);
  return router;
};
