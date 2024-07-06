import express from "express";
import {
  getAllTicket,
  getTicketByUser,
  cancelTicketByUser,
} from "../controller/TicketController";
export default (router: express.Router) => {
  router.post("/ticket/getallticket", getAllTicket);
  router.post("/ticket/getticketbyuser", getTicketByUser);
  router.post("/ticket/canceltiketbyuser", cancelTicketByUser);
};
