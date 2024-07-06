import express, { Request, Response } from "express";
import {
  genderPassword,
  genderToken,
  verifyPassword,
  verifyToken,
} from "../helper/authentication";
import { UserModel } from "../model/UserModel";

export const login = async (req: Request, res: Response) => {
  try {
    const { account, password } = req.body;
    if (account && password) {
      const user = await UserModel.findOne({ account }).select(
        "authentication.password"
      );
      if (!user) {
        return res.sendStatus(304);
      }

      if (await verifyPassword(password, user.authentication.password)) {
        const payload = {
          username: user.username,
          phone: user.phone,
        };
        const token = await genderToken(payload);
        if (token) {
          res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
          });
        }
        const refetchToken = await genderToken(payload);
        if (refetchToken) {
          res.cookie("refetchToken", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
          });
        }

        return res.status(200).json(user);
      }
    }
    return res.sendStatus(304);
  } catch (err) {
    console.error(err);
    return res.sendStatus(404);
  }
};

export const loginByToken = async (req: Request, res: Response) => {
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
          return res.status(200).json(user);
        }
      }
    }
    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.sendStatus(204);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, phone, account, password } = req.body;
    if (username && phone && account && password) {
      const user = await UserModel.findOne({ phone });
      if (user) {
        return res.sendStatus(204);
      } else {
        const newUser = await UserModel.create({
          username,
          phone,
          account,
          authentication: {
            password: await genderPassword(password),
          },
        });

        const payload = {
          username: username,
          phone: phone,
        };

        const token = await genderToken(payload);

        return res
          .status(200)
          .cookie("token", token, { httpOnly: true })
          .json(newUser);
      }
    }
    return res.sendStatus(304);
  } catch (err) {
    console.error(err);
    return res.sendStatus(404);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    return res.cookie("token", {}, { maxAge: 0 }).sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(404);
  }
};
