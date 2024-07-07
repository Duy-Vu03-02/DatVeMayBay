import express from "express";
import {
  getAllTicket,
  getTicketByUser,
  cancelTicketByUser,
  registerTicket,
  paymentTicket,
} from "../controller/TicketController";
import { authenUser } from "../middleware/authentication";

export default (router: express.Router) => {
  router.post("/ticket/getallticket", getAllTicket);
  router.post("/ticket/registerticket", authenUser, registerTicket);
  router.post("/ticket/getticketbyuser", authenUser, getTicketByUser);
  router.post("/ticket/canceltiketbyuser", authenUser, cancelTicketByUser);
  router.post("/ticket/paymentticket", authenUser, paymentTicket);
};
