import express, { Request, Response } from "express";
import { TicketModel } from "../model/TicketModel";
import { UserModel } from "../model/UserModel";
import { SoftFlightModel } from "../model/SoftFlight";
import { verifyToken } from "../helper/authentication";
import _ from "lodash";

export const getAllTicket = async (req: Request, res: Response) => {
  try {
    const { time } = req.body;
    if (time) {
      const timeStart = new Date(time);
      timeStart.setHours(0, 0, 0, 0);
      const timeEnd = new Date(time);
      timeEnd.setHours(23, 59, 59, 999);

      const ticket = await TicketModel.find({
        timeStart: { $gt: timeStart, $lt: timeEnd },
      });
      if (ticket.length > 0) {
        return res.status(200).json(ticket);
      }
      return res.sendStatus(201);
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(304);
  }
};

export const registerTicket = async (req: Request, res: Response) => {
  try {
    const { idUser, idTicket } = req.body;
    if (idTicket && idUser) {
      const ticket = await TicketModel.findById(idTicket);
      const user = await UserModel.findById(idUser);

      if (ticket && user && ticket.quantity > 0) {
        const softFlight = {
          idUser: idUser,
          idTicket: idTicket,
        };
        const newSoftFlight = await SoftFlightModel.create(softFlight);

        const update = await UserModel.findByIdAndUpdate(
          idUser,
          {
            $push: {
              flight: {
                idTicket: idTicket,
                idSoftFlight: newSoftFlight._id,
              },
            },
          },
          { new: true }
        );

        // Xác nhận thanh toán mới trừ
        // const updateTicket = await TicketModel.findByIdAndUpdate(
        //   idTicket,
        //   {
        //     $inc: { quantity: -1 },
        //   },
        //   { new: true }
        // );
        if (newSoftFlight && update) {
          return res.status(200).json({ user: update });
        }
      }
    }
    return res.sendStatus(304);
  } catch (err) {
    console.error(err);
    return res.sendStatus(404);
  }
};

export const getTicketByUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (token && token !== null && token.trim() !== "") {
      const verify = await verifyToken(token);
      if (!verify) {
        return res.sendStatus(204);
      }

      const payloadBase64 = token.split(".")[1];
      const payload: any = await JSON.parse(atob(payloadBase64));

      if (payload?.phone) {
        const user = await UserModel.findOne({ phone: payload.phone });
        if (user && user.username == payload.username) {
          const listTicket = user.flight;
          if (listTicket.length > 0) {
            let result: any[] = [];
            let temp: {} = {};
            for (let i = 0; i < listTicket.length; i++) {
              const ticket = await TicketModel.findById(listTicket[i].idTicket);
              // console.log(ticket);
              if (ticket) {
                temp = ticket;
              }

              if (listTicket[i].idSoftFlight) {
                const softFlight = await SoftFlightModel.findById(
                  listTicket[i].idSoftFlight
                );
                if (!softFlight) {
                }
              }

              result.push(temp);
            }
            return res.status(200).json(result);
          }
        }
      }
    }

    return res.sendStatus(304);
  } catch (err) {
    console.error(err);
    return res.sendStatus(404);
  }
};

export const cancelTicketByUser = async (res: Response, req: Request) => {
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
