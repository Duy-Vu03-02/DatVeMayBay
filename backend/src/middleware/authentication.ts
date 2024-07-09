import express, { Request, Response, NextFunction } from "express";
import {
  genderToken,
  verifyToken,
  verifyRefetchToken,
  genderRefetchToken,
} from "../helper/authentication";
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
          return;
        }
      }
    } else {
      return res.sendStatus(204);
    }
  } catch (err) {
    if (err.message === "TokenExpiredError") {
      console.log("refetch token");
      const refetchToken = req.cookies.refetchToken;
      if (refetchToken && refetchToken !== null && refetchToken.trim() !== "") {
        const verify = await verifyRefetchToken(refetchToken);
        if (!verify) {
          return res.sendStatus(204);
        }

        const payloadBase64 = refetchToken.split(".")[1];
        const payload: any = await JSON.parse(atob(payloadBase64));

        if (payload?.phone) {
          const user = await UserModel.findOne({ phone: payload.phone });
          if (user && user.username == payload.username) {
            const newToken = await genderToken({
              username: payload.username,
              phone: payload.phone,
            });
            if (newToken) {
              res.cookie("token", newToken, {
                httpOnly: true,
                // domain: "https://loginface.w3spaces.com",
                // path: "/",
                maxAge: 1000 * 60 * 60,
              });
            }
            req.cookies.token = newToken;
            next();
            return;
          }
        }
      }
    } else {
      console.error(err);
      return res.sendStatus(304);
    }
  }
};
