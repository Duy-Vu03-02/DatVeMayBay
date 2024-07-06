import {
  register,
  login,
  loginByToken,
  logout,
} from "../controller/UserController";
import { authenUser } from "../middleware/authentication";
import express from "express";

export default (router: express.Router) => {
  router.post("/auth/user/login", login);
  router.post("/auth/user/loginByToken", authenUser, loginByToken);
  router.post("/auth/user/register", register);
  router.post("/auth/user/logout", authenUser, logout);
};
