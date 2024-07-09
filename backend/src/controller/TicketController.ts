import express, { NextFunction, Request, Response } from "express";
import { TicketModel } from "../model/TicketModel";
import { UserModel } from "../model/UserModel";
import { SoftFlightModel } from "../model/SoftFlight";
import { verifyToken } from "../helper/authentication";
import _ from "lodash";
import moment from "moment";
import qs from "qs";
import crypto from "crypto";

export const DA_HET_VE = "Đã hết vé";
export const TU_DONG_HUY = "Tự động hủy";
export const DA_HUY = "Đã hủy";
export const THANH_TOAN = "Thanh toán";
export const DA_THANH_TOAN = "Đã thanh toán";

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

      if (
        ticket &&
        ticket.timeStart >= new Date() &&
        user &&
        ticket.quantity > 0
      ) {
        const softFlight = {
          idUser: idUser,
          idTicket: idTicket,
          state: THANH_TOAN,
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
          await update.save();
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
              if (ticket) {
                temp = ticket.toObject();
                temp = { ...temp, confirm: listTicket[i].confirm };
              }

              if (listTicket[i].idSoftFlight) {
                const softFlight = await SoftFlightModel.findById(
                  listTicket[i].idSoftFlight
                );

                if (!softFlight) {
                  temp = { ...temp, state: TU_DONG_HUY };
                } else {
                  if (softFlight.state === THANH_TOAN) {
                    temp = {
                      ...temp,
                      state: THANH_TOAN,
                      ablePayment: true,
                    };
                  } else {
                    temp = {
                      ...temp,
                      state: softFlight.state,
                    };
                  }
                  if (
                    softFlight.state === THANH_TOAN ||
                    softFlight.state === DA_THANH_TOAN
                  ) {
                    temp = {
                      ...temp,
                      ableCancel: true,
                      idSoftFlight: listTicket[i].idSoftFlight,
                    };
                  }
                  if (softFlight.state === DA_THANH_TOAN) {
                    temp = { ...temp, timePayment: listTicket[i].timePayment };
                  }
                }
              }

              result.push(temp);
            }
            return res.status(200).json(result);
          }
        }
      }
    }

    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.sendStatus(404);
  }
};

export const cancelTicketByUser = async (req: Request, res: Response) => {
  try {
    const { idSoftFlight, idTicket, idUser } = req.body;
    if (idSoftFlight && idTicket && idUser) {
      const update = await SoftFlightModel.findByIdAndUpdate(
        idSoftFlight,
        {
          createdAt: { expires: new Date("3000-07-07T09:22:00.200+00:00") },
          $set: {
            createdAt: new Date(),
            expires: new Date("3000-07-07T09:22:00.200+00:00"),
          },
          state: DA_HUY,
        },
        { new: true }
      );
      await update.save();
      if (update) {
        if (update.confirm) {
          const updateTicket = await TicketModel.findByIdAndUpdate(idTicket, {
            $inc: { quantity: 1 },
          });
          await updateTicket.save();
        }
        return res.sendStatus(200);
      }
    }
    return res.sendStatus(201);
  } catch (err) {
    console.error(err);
    return res.sendStatus(404);
  }
};

function sortObject(obj: any) {
  let keys = Object.keys(obj).sort();
  let sortedObj: any = {};
  keys.forEach((key) => {
    sortedObj[key] = obj[key];
  });
  return sortedObj;
}

export const paymentTicket = async (req: Request, res: Response) => {
  try {
    const { idSoftFlight, idUser, idTicket } = req.body;
    if (idSoftFlight && idUser && idTicket) {
      const softFlight = await SoftFlightModel.findById(idSoftFlight);

      if (softFlight && !softFlight.confirm) {
        const user = await UserModel.findById(idUser);
        if (user) {
          const ticket = await TicketModel.findById(idTicket);
          if (ticket) {
            if (
              softFlight.idUser.toString() === idUser.toString() &&
              softFlight.idTicket.toString() === idTicket.toString()
            ) {
              const user_update = await UserModel.findOneAndUpdate(
                {
                  _id: idUser,
                  "flight.idTicket": idTicket,
                  "flight.idSoftFlight": idSoftFlight,
                  "flight.confirm": false,
                },
                {
                  $set: {
                    "flight.$.confirm": true,
                    "flight.$.timePayment": new Date(),
                  },
                },
                { new: true }
              );
              await user_update.save();

              if (user_update) {
                const softFlight = await SoftFlightModel.findByIdAndUpdate(
                  idSoftFlight,
                  {
                    confirm: true,
                    state: DA_THANH_TOAN,
                    $unset: { expires: 1 },
                  }
                );
                await softFlight.save();

                if (softFlight) {
                  ticket.quantity = ticket.quantity - 1;
                  await ticket.save();
                  return res.status(200).json(user_update);
                }
              }
            }
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
