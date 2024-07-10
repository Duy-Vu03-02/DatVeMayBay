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
                state: THANH_TOAN,
              },
            },
          },
          { new: true }
        );

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

                if (
                  !softFlight &&
                  !listTicket[i].confirm &&
                  listTicket[i].state !== DA_HUY
                ) {
                  temp = { ...temp, state: TU_DONG_HUY };
                } else {
                  if (listTicket[i].state === THANH_TOAN) {
                    temp = {
                      ...temp,
                      state: ticket.quantity > 0 ? THANH_TOAN : DA_HET_VE,
                      ablePayment: ticket.quantity > 0 ? true : false,
                      ableCancel: true,
                      idSoftFlight: listTicket[i].idSoftFlight,
                    };
                  } else if (listTicket[i].state === DA_THANH_TOAN) {
                    temp = {
                      ...temp,
                      state: DA_THANH_TOAN,
                      timePayment: listTicket[i].timePayment,
                      ableCancel: true,
                      idSoftFlight: listTicket[i].idSoftFlight,
                    };
                  } else {
                    temp = {
                      ...temp,
                      state: listTicket[i].state,
                    };
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
      const update = await UserModel.findOneAndUpdate(
        {
          _id: idUser,
          "flight.idTicket": idTicket,
          "flight.idSoftFlight": idSoftFlight,
        },
        {
          $set: {
            "flight.$.state": DA_HUY,
          },
        },
        { new: true }
      );
      await update.save();
      if (update) {
        const updateTicket = await TicketModel.findByIdAndUpdate(idTicket, {
          $inc: { quantity: 1 },
        });
        await updateTicket.save();
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
                    "flight.$.state": DA_THANH_TOAN,
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

const handlePayment = async (req: Request, res: Response) => {
  try {
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      (req.socket && req.socket.remoteAddress);

    let tmnCode = process.env.VNP_TMN_CODE;
    let secretKey = process.env.VNP_HASH_SECRET;
    let vnpUrl = process.env.VNP_URL;
    let returnUrl = process.env.VNP_RETURN_URL;

    let date = moment();

    let createDate = date.format("YYYYMMDDHHmmss");
    let orderId = date.format("HHmmss");
    let amount = 10000;
    let bankCode = "NCB";

    let orderInfo = "Đặt Vé Máy Bay";
    let orderType = "billpayment";
    let locale = req.body.language as string;
    if (!locale || locale === "") {
      locale = "vn";
    }
    let currCode = "VND";

    let vnp_Params: any = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode) {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + qs.stringify(vnp_Params, { encode: false });

    res.redirect(vnpUrl);
  } catch (err) {
    console.error(err);
    return res.sendStatus(404);
  }
};
