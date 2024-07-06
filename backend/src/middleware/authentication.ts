import express, { Request, Response, NextFunction } from "express";
import { genderToken, verifyToken } from "../helper/authentication";
import { UserModel } from "../model/UserModel";

export const authenUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
          next();
        }
      }
    }
    return res.sendStatus(204);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const refetchToken = req.cookies.refetchToken;
      if (refetchToken && refetchToken !== null && refetchToken.trim() !== "") {
        const verify = await verifyToken(refetchToken);
        if (!verify) {
          return res.sendStatus(204);
        }

        const payloadBase64 = refetchToken.split(".")[1];
        const payload: any = await JSON.parse(atob(payloadBase64));

        if (payload?.phone) {
          const user = await UserModel.findOne({ phone: payload.phone });
          if (user && user.username == payload.username) {
            const token = await genderToken(payload);
            res.cookie("token", token, {
              httpOnly: true,
              maxAge: 1000 * 60 * 60,
            });
            next();
          }
        }
      }
    } else {
      return res.sendStatus(304);
    }
  }
};
