import express, { Request, Response } from "express";
import { TicketModel } from "model/TicketModel";
import { UserModel } from "model/UserModel";

export const getAllTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketModel.find();
    if (ticket.length > 0) {
      return res.status(200).json(ticket);
    }
    return res.sendStatus(201);
  } catch (err) {
    console.error(err);
    return res.sendStatus(304);
  }
};

export const getTicketByUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.body;
    if (userID && userID.trim() !== "") {
      const user = await UserModel.findById(userID);
      if (user) {
        const listTicket = user.flight;
        if (listTicket.length > 0) {
          let result: any[];

          for (let i = 0; i < listTicket.length; i++) {
            const ticket = await TicketModel.findById(listTicket[i]);
            if (ticket) {
              result.push(ticket);
            }
          }
          return res.status(200).json(result);
        }
      }
    }
    return res.sendStatus(304);
  } catch (err) {
    console.error(err);
    return res.sendStatus(404);
  }
};

const cancelTicketByUser = async (res: Response, req: Request) => {
  try {
    const { userID, ticketID } = req.body;
    const user = await UserModel.findById(userID);
    if (user) {
      const listTicket = user.flight;
      if (listTicket.length > 0) {
        const newList = listTicket.filter((item) => item != ticketID);

        return res.status(200).json(user);
      }
    }
    return;
  } catch (err) {
    console.error(err);
    return res.sendStatus(404);
  }
};
